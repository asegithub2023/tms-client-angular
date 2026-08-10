import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsChartComponent],
  templateUrl: './instructor-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructorDashboardComponent {
  store = inject(EnrollmentStore);

  constructor() {
    this.store.loadEnrollments();
  }
}