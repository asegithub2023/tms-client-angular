import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  pipe,
  concatMap,
  tap,
  catchError,
  EMPTY,
} from 'rxjs';
import { EnrollmentService } from '../services/enrollment';
import { LiveSyncService } from '../services/live-sync.service';
import { Enrollment } from '../models/enrollment.model';
export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
  }),
  withEntities<Enrollment>(),
  withComputed((store) => ({
    // Keep dashboard counts derived from the entity collection.
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
  })),
  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null,
          })
        ),
        concatMap(() =>
          api.getAll().pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), {
                isLoading: false,
              })
            ),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.message,
              });
              return EMPTY;
            })
          )
        )
      )
    ),
    approveEnrollment: rxMethod<number>(
      pipe(
        // Optimistically update the UI and restore Pending if the API rejects it.
        tap((id) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved',
              },
            })
          );
        }),
        concatMap((id) =>
          api.approve(id).pipe(
            catchError(() => {
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                })
              );
              patchState(store, {
                error: 'Server rejected the approval. Check enrollment constraints.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
    rejectEnrollment: rxMethod<number>(
      pipe(
        tap((id) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Rejected',
              },
            })
          );
        }),
        concatMap((id) =>
          api.reject(id).pipe(
            catchError(() => {
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                })
              );
              patchState(store, {
                error: 'Server rejected the rejection request.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        // Server-pushed status changes keep instructor views synchronized.
        tap(() => sync.connect()),
        concatMap(() => sync.events$),
        tap((event) => {
          patchState(
            store,
            updateEntity({
              id: event.id,
              changes: {
                status: event.status,
              },
            })
          );
        })
      )
    ),
  }))
);