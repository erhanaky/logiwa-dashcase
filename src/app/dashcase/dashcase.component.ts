import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { JobFilterComponent } from './job-filter/job-filter.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailSidebarComponent } from './job-detail-sidebar/job-detail-sidebar.component';
import { JobStateService } from './job-state.service';
import { Job } from '../shared/models/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashcase',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    JobFilterComponent,
    JobListComponent,
    JobDetailSidebarComponent,
  ],
  template: `
    <div class="container-fluid px-2 px-md-4 py-4">
      <h2 class="mb-4">Logiwa DashCase</h2>

      <div class="row gy-3">
        <div class="col-12 col-md-3">
          <div class="card border-0 shadow-none">
            <div class="card-body">
              <app-job-filter
                (filterChange)="onFilter($event)"
              ></app-job-filter>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-9">
          <div class="row gx-3 gy-3">
            <div class="col-12">
              <div class="card border-0 shadow-none">
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <app-job-list (selectJob)="onSelect($event)"></app-job-list>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div *ngIf="selectedJobId$ | async as id">
                <app-job-detail-sidebar
                  ngSkipHydration
                  [jobId]="id"
                  (statusChange)="onStatusChange($event.id, $event.status)"
                  (closeSidebar)="onSelect(null)"
                ></app-job-detail-sidebar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashcaseComponent {
  selectedJobId$: Observable<string | null>;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private jobState: JobStateService) {
    this.selectedJobId$ = this.jobState.selectedJobId$;
  }

  onFilter(filter: { status?: string; dateRange?: [string, string] }): void {
    console.debug('[Dashcase] filtre geldi:', filter);
    if (filter.status || filter.dateRange) {
      this.jobState.applyFilter(filter);
    } else {
      this.jobState.loadJobs();
    }
  }

  onSelect(id: string | null): void {
    this.jobState.selectJob(id);
  }

  onStatusChange(id: string, status: Job['status']): void {
    this.jobState.updateStatus(id, status);
  }
}
