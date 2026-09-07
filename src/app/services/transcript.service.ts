import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
export interface TranscriptStatus {
  reportId: string;
  studentId: number;
  state: number;
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  downloadUrl?: string;
  errorMessage?: string;
}
export interface DownloadedFile {
  blob: Blob;
  fileName: string;
}
@Injectable({ providedIn: 'root' })
export class TranscriptService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/transcripts';
  request(studentId: number): Observable<TranscriptStatus> {
    // A unique key prevents duplicate transcript jobs when a request is retried.
    const idempotencyKey = crypto.randomUUID();
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<TranscriptStatus>(this.baseUrl, { studentId }, { headers });
  }
  getStatus(reportId: string): Observable<TranscriptStatus> {
    return this.http.get<TranscriptStatus>(`${this.baseUrl}/${reportId}/status`);
  }
  download(reportId: string): Observable<DownloadedFile> {
    return this.http
      .get(`${this.baseUrl}/${reportId}/download`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          // Prefer the server filename while retaining a predictable fallback.
          const disposition = response.headers.get('content-disposition') ?? '';
          const match = /filename="?([^"]+)"?/.exec(disposition);
          const fileName = match?.[1] ?? `transcript-${reportId}.txt`;
          return { blob: response.body as Blob, fileName };
        })
      );
  }
}
