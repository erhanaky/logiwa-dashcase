import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DashcaseComponent } from './dashcase.component';
import { JobStateService } from './job-state.service';

describe('DashcaseComponent', () => {
  let component: DashcaseComponent;
  let fixture: ComponentFixture<DashcaseComponent>;
  let mockJobState: Partial<JobStateService>;

  beforeEach(async () => {
    mockJobState = {
      selectedJobId$: of(null),
      loadJobs: jasmine.createSpy('loadJobs'),
      applyFilterWithLoading: jasmine.createSpy('applyFilterWithLoading'),
      selectJob: jasmine.createSpy('selectJob'),
      updateStatus: jasmine.createSpy('updateStatus'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, DashcaseComponent],
      providers: [{ provide: JobStateService, useValue: mockJobState }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
