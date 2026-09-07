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