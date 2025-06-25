import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { JobListComponent } from './job-list.component';
import { JobStateService } from '../job-state.service';

describe('JobListComponent', () => {
  let fixture: ComponentFixture<JobListComponent>;
  let component: JobListComponent;
  let mockService: Partial<JobStateService>;

  beforeEach(async () => {
    mockService = {
      jobs$: of([]),
      loading$: of(false),
      error$: of(null),
      loadJobs: jasmine.createSpy('loadJobs'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, JobListComponent],
      providers: [{ provide: JobStateService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
