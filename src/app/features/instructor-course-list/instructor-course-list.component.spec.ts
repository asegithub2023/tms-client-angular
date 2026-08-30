import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { InstructorCourseListComponent } from './instructor-course-list.component';

describe('InstructorCourseListComponent', () => {
  let component: InstructorCourseListComponent;
  let fixture: ComponentFixture<InstructorCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorCourseListComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorCourseListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
