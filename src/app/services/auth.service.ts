import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'tms_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  currentUser = signal<TmsUser | null>(null);

  isLoggedIn = computed(() => !!this.accessToken());

  constructor() {
    // Rehydrate the user from a token already in the browser (e.g. after a
    // page refresh) so the session survives a reload.
    const existingToken = this.accessToken();
    if (existingToken) {
      this.setUserFromToken(existingToken);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/login', credentials)
    );

    this.accessToken.set(res.accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    this.setUserFromToken(res.accessToken);
  }

  async register(request: RegisterRequest): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>('/api/auth/register', request)
    );
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  private setUserFromToken(token: string): void {
    // Decode user payload from JWT (or fetch /api/auth/me)
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.currentUser.set({
      email: payload.email || payload.sub,
      displayName: payload.name || payload.email || 'User',
      role:
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || payload.role
        || 'Student'
    });
  }
}