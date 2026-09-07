import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../services/enrollment';
import { Enrollment } from '../../models/enrollment.model';
@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-enrollments.component.html',
  styleUrl: './my-enrollments.component.scss',
})
export class MyEnrollmentsComponent implements OnInit {
  private api = inject(EnrollmentService);
  enrollments = signal<Enrollment[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  ngOnInit(): void {
    this.reload();
  }
  reload(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.api.getMine().subscribe({
      next: (rows) => {
        this.enrollments.set(rows);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'Could not load your enrollments.');
        this.isLoading.set(false);
      },
    });
  }
}
