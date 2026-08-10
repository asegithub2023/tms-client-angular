import { Routes } from "@angular/router";
import { InstructorDashboardComponent } from "./features/instructor-dashboard/instructor-dashboard";
import { EnrollmentListComponent } from "./features/enrollment-list/enrollment-list";

export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/student-dashboard/student-dashboard").then(
        (m) => m.StudentDashboardComponent
      ),
  },

  {
    path: 'enrollments',
    component: EnrollmentListComponent
  },
  {
    path: "enroll",
    loadComponent: () =>
      import("./features/enrollment-form/enrollment-form").then(
        (m) => m.EnrollmentFormComponent
      ),
  },

  {
    path: 'instructor-dashboard',
    component: InstructorDashboardComponent
  },
  {
    path: "courses/:id",
    loadComponent: () =>
      import("./features/course-detail/course-detail").then(
        (m) => m.CourseDetailComponent
      ),
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];