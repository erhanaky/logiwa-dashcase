import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { JobDetailSidebarComponent } from './job-detail-sidebar.component';
import { JobDetailService, JobDetail } from '../job-detail.service';
import { JobStateService } from '../job-state.service';

describe('JobDetailSidebarComponent', () => {
  let fixture: ComponentFixture<JobDetailSidebarComponent>;
  let component: JobDetailSidebarComponent;
  let mockDetailSrv: jasmine.SpyObj<JobDetailService>;
  let mockStateSrv: jasmine.SpyObj<JobStateService>;

  beforeEach(async () => {
    mockDetailSrv = jasmine.createSpyObj('JobDetailService', ['getJobDetail']);
    mockStateSrv = jasmine.createSpyObj('JobStateService', [
      'updateStatus',
      'selectJob',
    ]);

    const fakeDetail: JobDetail = {
      id: '1',
      sku: 'X1',
      status: 'Pending',
      assignedUser: 'User A',
      createdDate: new Date().toISOString(),
      description: 'Fake detail',
    };
    mockDetailSrv.getJobDetail.and.returnValue(of(fakeDetail));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgIf,
        ReactiveFormsModule,
        JobDetailSidebarComponent,
      ],
      providers: [
        { provide: JobDetailService, useValue: mockDetailSrv },
        { provide: JobStateService, useValue: mockStateSrv },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job detail on jobId change', fakeAsync(() => {
    component.jobId = '1';
    component.ngOnChanges();
    tick(1500);
    fixture.detectChanges();
    expect(mockDetailSrv.getJobDetail).toHaveBeenCalledWith('1');
  }));

  it('should populate form with fetched status', fakeAsync(() => {
    component.jobId = '1';
    component.ngOnChanges();
    tick(1500);
    fixture.detectChanges();
    expect(component.statusForm.value.status).toBe('Pending');
  }));
});
