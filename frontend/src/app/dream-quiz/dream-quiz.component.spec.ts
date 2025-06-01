import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamQuizComponent } from './dream-quiz.component';

describe('DreamQuizComponent', () => {
  let component: DreamQuizComponent;
  let fixture: ComponentFixture<DreamQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DreamQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DreamQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
