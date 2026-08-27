import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course";
import { EnrollmentService } from "../../services/enrollment";
import { EnrollmentListComponent } from "../enrollment-list/enrollment-list";
import { EnrollmentStore } from "../../store/enrollment.store";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CourseCardComponent, RouterLink, EnrollmentListComponent],
  templateUrl: "./student-dashboard.html",
  styleUrls: ["./student-dashboard.scss"],
})
export class StudentDashboardComponent {
  private api = inject(CourseService);
  private enrollmentApi = inject(EnrollmentService);
  private auth = inject(AuthService);
  store = inject(EnrollmentStore);

  studentName = computed(() => this.auth.currentUser()?.displayName ?? "Student");
  private studentId = computed(() => this.auth.currentUser()?.studentId ?? null);

  earnedCredits = signal(45);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );

  selectedCourse = signal<Course | null>(null);
  enrollingCourseId = signal<number | null>(null);
  enrollMessage = signal<string | null>(null);

  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    const studentId = this.studentId();

    if (studentId === null) {
      this.enrollMessage.set(
        "Your account isn't linked to a student record. Log in with a Student account to enroll."
      );
      return;
    }

    this.selectedCourse.set(course);
    this.enrollingCourseId.set(course.id);
    this.enrollMessage.set(null);

    this.enrollmentApi
      .create({ studentId, courseCode: course.code })
      .subscribe({
        next: () => {
          this.enrollingCourseId.set(null);
          this.enrollMessage.set(`Enrolled in ${course.title}.`);
          this.store.loadEnrollments();
        },
        error: (err) => {
          this.enrollingCourseId.set(null);
          this.enrollMessage.set(
            err?.error?.detail ?? `Could not enroll in ${course.title}.`
          );
        },
      });
  }
}