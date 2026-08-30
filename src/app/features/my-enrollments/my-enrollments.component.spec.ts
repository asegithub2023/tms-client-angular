import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnrollmentsComponent } from './my-enrollments.component';

describe('MyEnrollmentsComponent', () => {
  let component: MyEnrollmentsComponent;
  let fixture: ComponentFixture<MyEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEnrollmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEnrollmentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
