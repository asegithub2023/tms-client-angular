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
      const previousSnapshot = store.entities();

      patchState(store, removeEntity(id));

      api
        .delete(id)
        .pipe(
          catchError(() => {
            patchState(store, setAllEntities(previousSnapshot));
            patchState(store, {
              error: 'Cannot delete course: active student enrollments exist.',
            });
            return EMPTY;
          })
        )
        .subscribe();
    },
  }))
);