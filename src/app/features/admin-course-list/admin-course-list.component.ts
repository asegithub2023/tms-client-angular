import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseStore } from '../../store/course.store';
import { CourseCardComponent } from '../../ui/course-card/course-card';
@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CourseCardComponent, RouterLink],
  templateUrl: './admin-course-list.component.html',
  styleUrl: './admin-course-list.component.scss',
})
export class AdminCourseListComponent implements OnInit {
  store = inject(CourseStore);
  ngOnInit(): void {
    this.store.loadCourses();
  }
  deleteCourse(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this course?');
    if (confirmDelete) {
      this.store.deleteCourse(id);
    }
  }
}