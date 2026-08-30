import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-instructor-course-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './instructor-course-list.component.html',
  styleUrl: './instructor-course-list.component.scss',
})
export class InstructorCourseListComponent implements OnInit {
  private api = inject(CourseService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getMine().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your courses.');
        this.isLoading.set(false);
      },
    });
  }
}