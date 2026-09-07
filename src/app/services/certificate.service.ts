import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
export interface CertificateResult {
  status: string;
  attempt: number;
}
@Injectable({ providedIn: 'root' })
export class CertificateService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/certificates';
  issue(studentId: number, courseCode: string): Observable<CertificateResult> {
    return this.http
      .post<CertificateResult>(this.baseUrl, { studentId, courseCode })
      .pipe(timeout(25000));
  }
}