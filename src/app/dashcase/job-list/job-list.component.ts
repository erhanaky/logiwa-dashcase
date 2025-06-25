import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { JobStateService } from '../job-state.service';
import { Job } from '../../shared/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, NgFor],
  template: `
    <ng-container *ngIf="loading$ | async; else notLoading">
      <div class="text-center my-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </ng-container>

    <ng-template #notLoading>
      <div
        *ngIf="error$ | async as err; else showData"
        class="alert alert-danger"
        role="alert"
      >
        {{ err }}
      </div>

      <ng-template #showData>
        <!-- Masaüstü: Tablo -->
        <div class="d-none d-md-block">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>SKU</th>
                <th>Status</th>
                <th>User</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let job of jobs$ | async"
                (click)="select(job.id)"
                tabindex="0"
                (keydown.enter)="select(job.id)"
                style="cursor: pointer"
              >
                <td>{{ job.id }}</td>
                <td>{{ job.sku }}</td>
                <td
                  class="status-cell text-nowrap"
                  [class.status-completed]="job.status === 'Completed'"
                  [class.status-pending]="job.status === 'Pending'"
                  [class.status-in-progress]="job.status === 'In Progress'"
                >
                  <i
                    *ngIf="job.status === 'Completed'"
                    class="bi bi-check-circle-fill text-success me-1"
                  ></i>
                  <i
                    *ngIf="job.status === 'In Progress'"
                    class="bi bi-hourglass-split text-warning me-1"
                  ></i>
                  <i
                    *ngIf="job.status === 'Pending'"
                    class="bi bi-clock-fill text-primary me-1"
                  ></i>
                  {{ job.status }}
                </td>
                <td>{{ job.assignedUser }}</td>
                <td>{{ job.createdDate | date: 'short' }}</td>
              </tr>
              <tr *ngIf="(jobs$ | async)?.length === 0">
                <td colspan="5" class="text-center text-muted">
                  No jobs match the selected criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobil: Kartlar -->
        <div class="d-block d-md-none">
          <div class="row row-cols-1 g-3">
            <ng-container *ngIf="jobs$ | async as list">
              <div *ngFor="let job of list" class="col">
                <div
                  class="card h-100 border-0 shadow-none"
                  (click)="select(job.id)"
                  tabindex="0"
                  (keydown.enter)="select(job.id)"
                  role="button"
                >
                  <div class="card-body">
                    <h6 class="card-title mb-2">{{ job.id }}</h6>
                    <p class="card-text mb-1">
                      <strong>SKU:</strong> {{ job.sku }}
                    </p>
                    <p
                      class="card-text mb-1 status-cell text-nowrap"
                      [class.status-completed]="job.status === 'Completed'"
                      [class.status-pending]="job.status === 'Pending'"
                      [class.status-in-progress]="job.status === 'In Progress'"
                    >
                      <strong class="me-1">Status:</strong>
                      <i
                        *ngIf="job.status === 'Completed'"
                        class="bi bi-check-circle-fill text-success me-1"
                      ></i>
                      <i
                        *ngIf="job.status === 'In Progress'"
                        class="bi bi-hourglass-split text-warning me-1"
                      ></i>
                      <i
                        *ngIf="job.status === 'Pending'"
                        class="bi bi-clock-fill text-primary me-1"
                      ></i>
                      {{ job.status }}
                    </p>
                    <p class="card-text mb-1">
                      <strong>User:</strong> {{ job.assignedUser }}
                    </p>
                    <p class="card-text mb-0">
                      <strong>Date:</strong>
                      {{ job.createdDate | date: 'short' }}
                    </p>
                  </div>
                </div>
              </div>
              <div *ngIf="list.length === 0" class="col">
                <div class="text-center text-muted py-4">
                  No jobs match the selected criteria.
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </ng-template>
    </ng-template>
  `,
})
export class JobListComponent implements OnInit {
  jobs$!: Observable<Job[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  @Output() selectJob = new EventEmitter<string>();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private jobState: JobStateService) {}

  ngOnInit(): void {
    this.jobs$ = this.jobState.jobs$;
    this.loading$ = this.jobState.loading$;
    this.error$ = this.jobState.error$;
    this.jobState.loadJobs();
  }

  select(id: string): void {
    this.selectJob.emit(id);
  }
}
