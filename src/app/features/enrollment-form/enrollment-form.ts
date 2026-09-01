import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { rxResource } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CourseService } from "../../services/course";
import { EnrollmentService } from "../../services/enrollment";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-enrollment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./enrollment-form.html",
  styleUrl: "./enrollment-form.scss",
})
export class EnrollmentFormComponent {
  private fb = inject(FormBuilder);
  private courseApi = inject(CourseService);
  private enrollmentApi = inject(EnrollmentService);
  private auth = inject(AuthService);

  private studentId = computed(() => this.auth.currentUser()?.studentId ?? null);

  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  coursesResource = rxResource({
    stream: () => this.courseApi.getAll(),
  });

  form = this.fb.nonNullable.group({
    courseCode: ["", Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const studentId = this.studentId();
    if (studentId === null) {
      this.errorMessage.set(
        "Your account isn't linked to a student record. Log in with a Student account to enroll."
      );
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.enrollmentApi
      .create({ studentId, courseCode: this.form.getRawValue().courseCode })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.submitted.set(true);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err?.error?.detail ?? "Could not complete enrollment. Please try again."
          );
        },
      });
  }
}