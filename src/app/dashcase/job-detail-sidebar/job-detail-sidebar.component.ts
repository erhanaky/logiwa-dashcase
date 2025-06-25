import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import {
  CommonModule,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JobStateService } from '../job-state.service';
import { Job } from '../../shared/models/job.model';
import { JobDetailService, JobDetail } from '../job-detail.service';

@Component({
  selector: 'app-job-detail-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="offcanvas offcanvas-end show"
      tabindex="-1"
      style="visibility: visible; width: 320px"
      *ngIf="job$ | async as job"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Job {{ job.id }} Details</h5>
        <button type="button" class="btn-close" (click)="close()">
          <span class="visually-hidden">Close</span>
        </button>
      </div>

      <div class="offcanvas-body">
        <p><strong>SKU:</strong> {{ job.sku }}</p>

        <!-- Iconlu ve renkli Status badge -->
        <p class="d-flex align-items-center">
          <strong class="me-1">Status:</strong>
          <ng-container [ngSwitch]="job.status">
            <span
              *ngSwitchCase="'Completed'"
              class="badge bg-success d-inline-flex align-items-center"
            >
              <i class="bi bi-check-circle-fill me-1"></i>
              Completed
            </span>
            <span
              *ngSwitchCase="'In Progress'"
              class="badge bg-warning text-dark d-inline-flex align-items-center"
            >
              <i class="bi bi-hourglass-split me-1"></i>
              In Progress
            </span>
            <span
              *ngSwitchCase="'Pending'"
              class="badge bg-primary d-inline-flex align-items-center"
            >
              <i class="bi bi-clock-fill me-1"></i>
              Pending
            </span>
            <span
              *ngSwitchDefault
              class="badge bg-secondary d-inline-flex align-items-center"
            >
              <i class="bi bi-question-circle-fill me-1"></i>
              {{ job.status }}
            </span>
          </ng-container>
        </p>

        <p><strong>User:</strong> {{ job.assignedUser }}</p>
        <p><strong>Created:</strong> {{ job.createdDate | date: 'short' }}</p>
        <p><strong>Description:</strong> {{ job.description }}</p>

        <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
          <div class="mb-3">
            <label for="status" class="form-label">Update Status</label>
            <select id="status" class="form-select" formControlName="status">
              <option value="" disabled>-- Select --</option>
              <option *ngFor="let s of statuses" [value]="s">
                {{ s }}
              </option>
            </select>
            <div
              *ngIf="statusForm.get('status')?.invalid && statusForm.touched"
              class="text-danger"
            >
              Lütfen bir statü seçin.
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="statusForm.invalid"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  `,
})
export class JobDetailSidebarComponent implements OnChanges {
  @Input() jobId: string | null = null;
  @Output() statusChange = new EventEmitter<{
    id: string;
    status: Job['status'];
  }>();
  @Output() closeSidebar = new EventEmitter<void>();

  private _jobDetailSubject = new BehaviorSubject<JobDetail | null>(null);
  job$!: Observable<JobDetail>;
  statusForm!: FormGroup;
  statuses: Job['status'][] = ['Pending', 'In Progress', 'Completed'];
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private jobDetailService: JobDetailService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private jobState: JobStateService,
  ) {
    this.job$ = this._jobDetailSubject.asObservable() as Observable<JobDetail>;
  }

  ngOnChanges(): void {
    if (this.jobId) {
      this.loadJobDetail(this.jobId);
      this.initForm();
    }
  }

  private loadJobDetail(id: string): void {
    this.loading$.next(true);
    this.jobDetailService
      .getJobDetail(id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((detail) => {
        this._jobDetailSubject.next(detail);
        this.statusForm.patchValue({ status: detail.status });
      });
  }

  private initForm(): void {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
    });
  }

  updateStatus(): void {
    if (!this.jobId) {
      return;
    }
    const newStatus = this.statusForm.value.status as Job['status'];

    this.statusChange.emit({ id: this.jobId, status: newStatus });

    const current = this._jobDetailSubject.getValue();
    if (current) {
      this._jobDetailSubject.next({ ...current, status: newStatus });
    }

    this.jobState.updateStatus(this.jobId, newStatus);
  }

  close(): void {
    this.closeSidebar.emit();
  }
}
