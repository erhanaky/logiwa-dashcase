import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { JobStateService } from '../job-state.service';
import { Job } from '../../shared/models/job.model';
import { JobDetailService, JobDetail } from '../job-detail.service';

import { Validators } from '@angular/forms';

@Component({
  selector: 'app-job-detail-sidebar',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  template: `
    <div
      class="offcanvas offcanvas-end show"
      tabindex="-1"
      style="visibility: visible; width: 320px"
      *ngIf="job$ | async as job"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Job {{ job.id }} Details</h5>
        <button type="button" class="btn-close" (click)="close()"></button>
      </div>
      <div class="offcanvas-body">
        <p><strong>SKU:</strong> {{ job.sku }}</p>
        <p><strong>Status:</strong> {{ job.status }}</p>
        <p><strong>User:</strong> {{ job.assignedUser }}</p>
        <p><strong>Created:</strong> {{ job.createdDate | date : 'short' }}</p>
        <p><strong>Description:</strong> {{ job.description }}</p>

        <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
          <div class="mb-3">
            <label for="status" class="form-label">Update Status</label>
            <select id="status" class="form-select" formControlName="status">
              <option value="" disabled>-- Select --</option>
              <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
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

  job$!: Observable<JobDetail>;
  statusForm!: FormGroup;
  statuses: Job['status'][] = ['Pending', 'In Progress', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private jobDetailService: JobDetailService,
    private jobState: JobStateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.jobId) {
      this.job$ = this.jobDetailService.getJobDetail(this.jobId);
      this.statusForm = this.fb.group({
        status: ['', Validators.required],
      });
      this.job$.subscribe((job) => {
        this.statusForm.patchValue({ status: job.status });
      });
    }
  }

  updateStatus() {
    if (!this.jobId) return;
    const status = this.statusForm.value.status as Job['status'];
    this.statusChange.emit({ id: this.jobId, status });
  }

  close() {
    this.closeSidebar.emit();
  }
}
