import { Component, inject, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Course } from "../../models/course.model";
import { AuthService } from "../../services/auth.service";
@Component({
  selector: "tms-course-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./course-card.html",
  styleUrl: "./course-card.scss",
})
export class CourseCardComponent {
  auth = inject(AuthService);
  course = input.required<Course>();
  busy = input(false);
  enrollClicked = output<Course>();
  deleteClicked = output<Course>();
}