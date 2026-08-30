import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';
import { TranscriptService, TranscriptStatus } from '../../services/transcript.service';
import { AuthService } from '../../services/auth.service';

const READY = 2;
const FAILED = 3;

const STATE_LABELS: Record<number, string> = {
  0: 'Queued',
  1: 'Processing',
  2: 'Ready',
  3: 'Failed',
};

@Component({
  selector: 'app-transcript-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transcript-request.component.html',
  styleUrl: './transcript-request.component.scss',
})
export class TranscriptRequestComponent implements OnDestroy {
  private api = inject(TranscriptService);
  private auth = inject(AuthService);

  status = signal<TranscriptStatus | null>(null);
  errorMessage = signal<string | null>(null);
  isRequesting = signal(false);

  private studentId = computed(() => this.auth.currentUser()?.studentId ?? null);
  private pollSub?: Subscription;

  readonly READY = READY;
  readonly FAILED = FAILED;

  stateLabel(state: number): string {
    return STATE_LABELS[state] ?? 'Unknown';
  }

  private isDone(state: number): boolean {
    return state === READY || state === FAILED;
  }

  request(): void {
    const studentId = this.studentId();

    if (studentId === null) {
      this.errorMessage.set("Your account isn't linked to a student record.");
      return;
    }

    this.isRequesting.set(true);
    this.errorMessage.set(null);
    this.status.set(null);
    this.pollSub?.unsubscribe();

    this.api.request(studentId).subscribe({
      next: (status) => {
        this.isRequesting.set(false);
        this.status.set(status);
        this.startPolling(status.reportId);
      },
      error: (err) => {
        this.isRequesting.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'Could not request a transcript.');
      },
    });
  }

  private startPolling(reportId: string): void {
    this.pollSub = interval(2000)
      .pipe(
        switchMap(() => this.api.getStatus(reportId)),
        takeWhile((status) => !this.isDone(status.state), true)
      )
      .subscribe({
        next: (status) => this.status.set(status),
        error: () => this.errorMessage.set('Lost track of the transcript request status.'),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }
}