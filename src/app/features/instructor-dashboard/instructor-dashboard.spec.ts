// happy-dom/JSDOM don't implement IntersectionObserver, which Angular's
// `@defer (on viewport)` trigger relies on internally. Without this, the
// deferred block throws asynchronously after the test has already
// finished, and that uncaught error can crash the Vitest worker process
// running other spec files scheduled on the same worker.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
(globalThis as any).IntersectionObserver = MockIntersectionObserver;

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';

import { InstructorDashboardComponent } from './instructor-dashboard';
import { LiveSyncService } from '../../services/live-sync.service';

describe('InstructorDashboardComponent', () => {
  let component: InstructorDashboardComponent;
  let fixture: ComponentFixture<InstructorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: LiveSyncService, useValue: { connect: () => {}, events$: EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});