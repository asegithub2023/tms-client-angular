import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  EMPTY,
  catchError,
  concatMap,
  pipe,
  tap,
} from 'rxjs';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course';
export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    deleteStatus: 'idle' as 'idle' | 'deleting' | 'success' | 'error',
  }),
  withEntities<Course>(),
  withMethods((store, api = inject(CourseService)) => ({
    loadCourses: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null,
          })
        ),
        concatMap(() =>
          api.getAll().pipe(
            tap((courses) =>
              patchState(store, setAllEntities(courses), {
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
    deleteCourse(id: number) {
      // Remove immediately for responsiveness and restore the snapshot on failure.
      const previousSnapshot = store.entities();
      patchState(store, removeEntity(id), {
        deleteStatus: 'deleting',
        error: null,
      });
      api
        .delete(id)
        .pipe(
          catchError((err) => {
            patchState(store, setAllEntities(previousSnapshot));
            patchState(store, {
              error:
                err?.error?.detail ??
                'Cannot delete course: active student enrollments exist.',
              deleteStatus: 'error',
            });
            return EMPTY;
          })
        )
        .subscribe(() => {
          patchState(store, { deleteStatus: 'success' });
        });
    },
  }))
);