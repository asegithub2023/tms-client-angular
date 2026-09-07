import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { AuthService } from '../../services/auth.service';
import { InstructorOption } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(CourseService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseId = signal<number | null>(null);
  isEditMode = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  isAdmin = computed(() => this.auth.hasRole('Admin') && this.auth.isExactRole('Admin'));
  instructors = signal<InstructorOption[]>([]);

  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    maxCapacity: [30, [Validators.required, Validators.min(1), Validators.max(200)]],
    instructorId: [''],
  });

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.api.getInstructors().subscribe({
        next: (list) => this.instructors.set(list),
        error: () => this.errorMessage.set('Could not load the instructor list.'),
      });
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.courseId.set(id);
      this.isEditMode.set(true);
      // The backend's UpdateCourseDto only supports changing the Title (and,
      // for Admin, the assigned Instructor) - Code and Max Capacity are
      // fixed at creation time, so lock those fields rather than imply
      // they're editable.
      this.form.controls.code.disable();
      this.form.controls.maxCapacity.disable();
      this.loadCourse(id);
    }
  }

  private loadCourse(id: number): void {
    this.isLoading.set(true);
    this.api.getById(id).subscribe({
      next: (course) => {
        this.form.patchValue({
          code: course.code,
          title: course.title,
          maxCapacity: course.maxCapacity,
          instructorId: course.instructorId ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load this course.');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const id = this.courseId();
    const raw = this.form.getRawValue();
    const instructorId = this.isAdmin() ? (raw.instructorId || null) : undefined;

    if (id !== null) {
      this.api.update(id, { title: raw.title, instructorId }).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl(this.successRedirectUrl());
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err?.error?.detail ?? 'Could not update the course.');
        },
      });
    } else {
      this.api
        .create({
          code: raw.code,
          title: raw.title,
          maxCapacity: raw.maxCapacity,
          instructorId,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.router.navigateByUrl(this.successRedirectUrl());
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(
              err?.error?.detail ?? 'Could not create the course. Check the course code is unique.'
            );
          },
        });
    }
  }

  // Admin manages the full course list at /admin/courses (Admin-only route).
  // An Instructor isn't allowed there - their landing page after
  // create/edit is their own course list instead.
  private successRedirectUrl(): string {
    return this.isAdmin() ? '/admin/courses' : '/instructor/courses';
  }
}