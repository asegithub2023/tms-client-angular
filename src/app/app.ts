import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnrollmentStore } from './store/enrollment.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('tms-client');
  private store = inject(EnrollmentStore);

  ngOnInit(): void {
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
}
