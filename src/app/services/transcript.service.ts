import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// The backend's TranscriptState enum has no JsonStringEnumConverter
// registered, so it serializes as a raw number: 0=Queued, 1=Processing,
// 2=Ready, 3=Failed.
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
          const disposition = response.headers.get('content-disposition') ?? '';
          const match = /filename="?([^"]+)"?/.exec(disposition);
          const fileName = match?.[1] ?? `transcript-${reportId}.txt`;
          return { blob: response.body as Blob, fileName };
        })
      );
  }
}
