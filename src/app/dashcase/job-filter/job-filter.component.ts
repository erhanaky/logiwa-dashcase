import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="filterForm" class="d-grid gap-3">
      <div>
        <label for="status" class="form-label">Status</label>
        <select id="status" class="form-select" formControlName="status">
          <option value="">All</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
      </div>

      <div>
        <label for="startDate" class="form-label">From</label>
        <input
          id="startDate"
          type="date"
          class="form-control"
          [class.is-invalid]="showDateError && !filterForm.value.startDate"
          formControlName="startDate"
        />
      </div>

      <div>
        <label for="endDate" class="form-label">To</label>
        <input
          id="endDate"
          type="date"
          class="form-control"
          [class.is-invalid]="showDateError && !filterForm.value.endDate"
          formControlName="endDate"
        />
      </div>

      <div *ngIf="showDateError" class="text-danger">
        Both From and To dates must be selected to filter by date range.
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary flex-grow-1"
          (click)="clearFilters()"
        >
          Clear Filters
        </button>
        <button
          type="button"
          class="btn btn-primary flex-grow-1"
          (click)="applyFilters()"
        >
          Search
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .is-invalid {
        border-color: #dc3545;
      }
    `,
  ],
})
export class JobFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<{
    status?: string;
    dateRange?: [string, string];
  }>();

  filterForm!: FormGroup;
  statuses = ['Pending', 'In Progress', 'Completed'];

  showDateError = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      status: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  applyFilters() {
    const { status, startDate, endDate } = this.filterForm.value;

    if ((startDate && !endDate) || (!startDate && endDate)) {
      this.showDateError = true;
      return;
    }

    this.showDateError = false;

    const filter: { status?: string; dateRange?: [string, string] } = {};
    if (status) {
      filter.status = status;
    }
    if (startDate && endDate) {
      filter.dateRange = [startDate, endDate];
    }

    this.filterChange.emit(filter);
  }

  clearFilters() {
    this.filterForm.reset({ status: '', startDate: '', endDate: '' });
    this.showDateError = false;
    this.filterChange.emit({});
  }
}
