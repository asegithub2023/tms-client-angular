import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

export interface CreateEnrollmentRequest {
  studentId: number;
  courseCode: string;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/enrollments';

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  getMine(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/mine`);
  }

  create(request: CreateEnrollmentRequest): Observable<unknown> {
    return this.http.post(this.baseUrl, request);
  }

  approve(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reject`, {});
  }
}