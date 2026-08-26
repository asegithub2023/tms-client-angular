import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course";
import { EnrollmentService } from "../../services/enrollment";
import { EnrollmentListComponent } from "../enrollment-list/enrollment-list";
import { EnrollmentStore } from "../../store/enrollment.store";

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
  store = inject(EnrollmentStore);

  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);

  // NOTE: there is no link yet between a logged-in account and a Student
  // record, so this demo dashboard enrolls against a fixed seeded student
  // (id 1 = "AliceSmith" from the startup seed data).
  private demoStudentId = 1;

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
    this.selectedCourse.set(course);
    this.enrollingCourseId.set(course.id);
    this.enrollMessage.set(null);

    this.enrollmentApi
      .create({ studentId: this.demoStudentId, courseCode: course.code })
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