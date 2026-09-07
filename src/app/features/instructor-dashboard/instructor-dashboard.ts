import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart';
import { EnrollmentStore } from '../../store/enrollment.store';
@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsChartComponent, RouterLink],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructorDashboardComponent {
  store = inject(EnrollmentStore);
  constructor() {
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
}