import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course";
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
  store = inject(EnrollmentStore);

  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );

  selectedCourse = signal<Course | null>(null);

  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log("Enrollment requested for:", course.title);
  }
}