import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CertificateService } from '../../services/certificate.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-certificate-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-request.component.html',
  styleUrl: './certificate-request.component.scss',
})
export class CertificateRequestComponent {
  private api = inject(CertificateService);
  private auth = inject(AuthService);
  courseCode = signal('');
  isRequesting = signal(false);
  resultMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  private studentId = computed(() => this.auth.currentUser()?.studentId ?? null);
  updateCourseCode(value: string): void {
    this.courseCode.set(value);
  }
  request(): void {
    const studentId = this.studentId();
    const courseCode = this.courseCode().trim();
    if (studentId === null) {
      this.errorMessage.set("Your account isn't linked to a student record.");
      return;
    }
    if (!courseCode) {
      this.errorMessage.set('Enter the course code the certificate is for.');
      return;
    }
    this.isRequesting.set(true);
    this.resultMessage.set(null);
    this.errorMessage.set(null);
    this.api.issue(studentId, courseCode).subscribe({
      next: (result: { status: string; attempt: number }) => {
        this.isRequesting.set(false);
        this.resultMessage.set(
          `Certificate ${result.status} (attempt ${result.attempt}).`
        );
      },
      error: (err: unknown) => {
        this.isRequesting.set(false);
        const detail = err instanceof HttpErrorResponse
          && typeof err.error === 'object'
          && err.error !== null
          && 'detail' in err.error
          && typeof (err.error as { detail?: unknown }).detail === 'string'
          ? (err.error as { detail: string }).detail
          : null;
        this.errorMessage.set(
          detail ?? 'The certificate service is unavailable right now. Please try again.'
        );
      },
    });
  }
}