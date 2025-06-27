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
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-tag-fill"></i>
          </span>
          <select id="status" class="form-select" formControlName="status">
            <option value="">All</option>
            <option *ngFor="let s of statuses" [value]="s">
              {{ s }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label for="startDate" class="form-label">From</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-calendar-event"></i>
          </span>
          <input
            id="startDate"
            type="date"
            class="form-control"
            formControlName="startDate"
            [class.is-invalid]="
              singleSelectError && !filterForm.value.startDate
            "
          />
        </div>
      </div>

      <div>
        <label for="endDate" class="form-label">To</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-calendar-event"></i>
          </span>
          <input
            id="endDate"
            type="date"
            class="form-control"
            formControlName="endDate"
            [class.is-invalid]="singleSelectError && !filterForm.value.endDate"
          />
        </div>
      </div>

      <div *ngIf="singleSelectError" class="text-danger">
        Both From and To dates must be selected to filter by date range.
      </div>
      <div *ngIf="rangeError" class="text-danger">
        End date cannot be earlier than start date. Start date reset to match
        end date.
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary flex-fill"
          (click)="clearFilters()"
        >
          Clear Filters
        </button>
        <button
          type="button"
          class="btn btn-primary flex-fill"
          (click)="applyFilters()"
        >
          Search
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .input-group-text {
        background-color: transparent;
        border-right: 0;
      }
      .form-select,
      .form-control {
        border-left: 0;
      }
      .is-invalid {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
      }
    `,
  ],
})
export class JobFilterComponent implements OnInit {
  @Output()
  filterChange = new EventEmitter<{
    status?: string;
    dateRange?: [string, string];
  }>();

  filterForm!: FormGroup;
  statuses = ['Pending', 'In Progress', 'Completed'];

  singleSelectError = false;
  rangeError = false;

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
      this.singleSelectError = true;
      this.rangeError = false;
      return;
    }

    if (startDate && endDate) {
      const from = new Date(startDate);
      const to = new Date(endDate);
      if (to < from) {
        this.filterForm.patchValue({ startDate: endDate });
        this.rangeError = true;
        this.singleSelectError = false;
        return;
      }
    }

    this.singleSelectError = false;
    this.rangeError = false;

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
    this.filterForm.reset({
      status: '',
      startDate: '',
      endDate: '',
    });
    this.singleSelectError = false;
    this.rangeError = false;
    this.filterChange.emit({});
  }
}
