import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashcaseComponent } from './dashcase.component';

describe('DashcaseComponent', () => {
  let component: DashcaseComponent;
  let fixture: ComponentFixture<DashcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
