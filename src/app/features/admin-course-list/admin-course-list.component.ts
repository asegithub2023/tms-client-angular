import { Component, inject, OnInit } from '@angular/core';
import { CourseStore } from '../../store/course.store';
import { CourseCardComponent } from '../../ui/course-card/course-card';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './admin-course-list.component.html',
})
export class AdminCourseListComponent implements OnInit {
  store = inject(CourseStore);

  ngOnInit(): void {
    this.store.loadCourses();
  }
}