import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Course, PagedResponse } from "../models/course.model";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = "http://localhost:5196/api/courses";

  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: { page: "1", pageSize: "50" },
      })
      .pipe(map((p) => p.items));
  }

  getById(id: string) {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }
}