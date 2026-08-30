import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {
  Course,
  CourseDetail,
  CreateCourseRequest,
  InstructorOption,
  PagedResponse,
  UpdateCourseRequest,
} from "../models/course.model";
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/courses`;
  private readonly adminBase = '/api/courses';

  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: { page: '1', pageSize: '50' }
      })
      .pipe(map(response => response.items));
  }

  getById(id: number) {
    return this.http.get<CourseDetail>(`${this.adminBase}/${id}`);
  }

  getInstructors() {
    return this.http.get<InstructorOption[]>(`${this.adminBase}/instructors`);
  }

  getMine() {
    return this.http.get<Course[]>(`${this.adminBase}/mine`);
  }

  create(request: CreateCourseRequest) {
    return this.http.post<Course>(this.adminBase, request);
  }

  update(id: number, request: UpdateCourseRequest) {
    return this.http.put<void>(`${this.adminBase}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.adminBase}/${id}`);
  }
}