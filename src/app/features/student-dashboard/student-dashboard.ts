import { Component, computed, inject, signal, viewChild } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course";
import { EnrollmentService } from "../../services/enrollment";
import { AuthService } from "../../services/auth.service";
import { MyEnrollmentsComponent } from "../my-enrollments/my-enrollments.component";
import { CertificateRequestComponent } from "../certificate-request/certificate-request.component";
import { TranscriptRequestComponent } from "../transcript-request/transcript-request.component";
@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [
    CourseCardComponent,
    RouterLink,
    MyEnrollmentsComponent,
    CertificateRequestComponent,
    TranscriptRequestComponent,
  ],
  templateUrl: "./student-dashboard.html",
  styleUrls: ["./student-dashboard.scss"],
})
export class StudentDashboardComponent {
  private api = inject(CourseService);
  private enrollmentApi = inject(EnrollmentService);
  private auth = inject(AuthService);
  private myEnrollments = viewChild(MyEnrollmentsComponent);
  studentName = computed(() => this.auth.currentUser()?.displayName ?? "Student");
  private studentId = computed(() => this.auth.currentUser()?.studentId ?? null);
  earnedCredits = signal(45);
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );
  pendingCount = computed(
    () => this.myEnrollments()?.enrollments().filter((e) => e.status === 'Pending').length ?? 0
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
          this.myEnrollments()?.reload();
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