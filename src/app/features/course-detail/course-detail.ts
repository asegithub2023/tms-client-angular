import { Component, effect, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CourseStore } from "../../store/course.store";

@Component({
  selector: "app-course-detail",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./course-detail.html",
  styleUrl: "./course-detail.scss",
})
export class CourseDetailComponent {
  id = input.required<string>();

  auth = inject(AuthService);
  private store = inject(CourseStore);
  private router = inject(Router);

  constructor() {
    effect(() => {
      console.log(`Loading course detail for ID: ${this.id()}`);
    });
  }

  deleteCourse(): void {
    this.store.deleteCourse(Number(this.id()));
    this.router.navigateByUrl('/dashboard');
  }
}