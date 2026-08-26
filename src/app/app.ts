import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('tms-client');
  private store = inject(EnrollmentStore);
  auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
