import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptRequestComponent } from './transcript-request.component';

describe('TranscriptRequestComponent', () => {
  let component: TranscriptRequestComponent;
  let fixture: ComponentFixture<TranscriptRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
