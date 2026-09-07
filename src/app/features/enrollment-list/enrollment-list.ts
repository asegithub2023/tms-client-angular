import { Component, viewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentListComponent {
  store = inject(EnrollmentStore);
  displayedColumns = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
  approve(id: number): void {
    this.store.approveEnrollment(id);
  }
  reject(id: number): void {
    this.store.rejectEnrollment(id);
  }
  getStatusBadgeClass(status: string): string {
    const baseClass = 'badge';
    switch (status) {
      case 'Pending':
        return `${baseClass} badge-pending`;
      case 'Approved':
        return `${baseClass} badge-approved`;
      case 'Rejected':
        return `${baseClass} badge-rejected`;
      default:
        return baseClass;
    }
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bi bi-hourglass-split';
      case 'Approved':
        return 'bi bi-check-circle-fill';
      case 'Rejected':
        return 'bi bi-x-circle-fill';
      default:
        return 'bi bi-question-circle';
    }
  }
}