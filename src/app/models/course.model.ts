export interface Course {
id: number;
code: string;
title: string;
maxCapacity: number;
enrollmentCount: number;
status?: string;
instructorId?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface CourseLink {
  href: string;
  rel: string;
  method: string;
}

export interface CourseDetail extends Course {
  links: readonly CourseLink[];
}

export interface CreateCourseRequest {
  code: string;
  title: string;
  maxCapacity: number;
  instructorId?: string | null;
}

export interface UpdateCourseRequest {
  title: string;
  instructorId?: string | null;
}

export interface InstructorOption {
  id: string;
  name: string;
}