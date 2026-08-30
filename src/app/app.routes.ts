import { Routes } from "@angular/router";
import { InstructorDashboardComponent } from "./features/instructor-dashboard/instructor-dashboard";
import { EnrollmentListComponent } from "./features/enrollment-list/enrollment-list";
import { AdminCourseListComponent } from "./features/admin-course-list/admin-course-list.component";
import { roleGuard } from "./guards/role.guard";
import { authGuard } from "./guards/auth.guard";
import { studentDashboardGuard } from "./guards/student-dashboard.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./features/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "unauthorized",
    loadComponent: () =>
      import("./features/unauthorized/unauthorized.component").then(
        (m) => m.UnauthorizedComponent
      ),
  },

  {
    path: "dashboard",
    canActivate: [studentDashboardGuard],
    loadComponent: () =>
      import("./features/student-dashboard/student-dashboard").then(
        (m) => m.StudentDashboardComponent
      ),
  },

  {
    path: 'enrollments',
    component: EnrollmentListComponent,
    canActivate: [roleGuard('Instructor')],
  },
  {
    path: "enroll",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/enrollment-form/enrollment-form").then(
        (m) => m.EnrollmentFormComponent
      ),
  },


  {
    path: 'grade-submission',
    canActivate: [roleGuard('Instructor')],
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(
        (m) => m.GradeSubmissionComponent
      ),
  },

  {
    path: 'instructor-dashboard',
    component: InstructorDashboardComponent,
    canActivate: [roleGuard('Instructor')],
  },
  {
    path: 'instructor/courses',
    canActivate: [roleGuard('Instructor')],
    loadComponent: () =>
      import('./features/instructor-course-list/instructor-course-list.component').then(
        (m) => m.InstructorCourseListComponent
      ),
  },
  {
    path: "courses/:id",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/course-detail/course-detail").then(
        (m) => m.CourseDetailComponent
      ),
  },

{
  path: 'admin/courses/new',
  canActivate: [roleGuard('Instructor')],
  loadComponent: () =>
    import('./features/course-form/course-form.component').then(
      (m) => m.CourseFormComponent
    ),
},
{
  path: 'admin/courses/:id/edit',
  canActivate: [roleGuard('Instructor')],
  loadComponent: () =>
    import('./features/course-form/course-form.component').then(
      (m) => m.CourseFormComponent
    ),
},
{
  path: 'admin/courses',
  component: AdminCourseListComponent,
  canActivate: [roleGuard('Admin')]
},


  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];