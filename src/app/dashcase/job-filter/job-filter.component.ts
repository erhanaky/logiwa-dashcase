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
          formControlName="startDate"
        />
      </div>

      <div>
        <label for="endDate" class="form-label">To</label>
        <input
          id="endDate"
          type="date"
          class="form-control"
          formControlName="endDate"
        />
      </div>

      <div>
        <button
          type="button"
          class="btn btn-outline-secondary w-100"
          (click)="clearFilters()"
        >
          Clear Filters
        </button>
      </div>
    </form>
  `,
})
export class JobFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<{
    status?: string;
    dateRange?: [string, string];
  }>();

  filterForm!: FormGroup;
  statuses = ['Pending', 'In Progress', 'Completed'];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      status: [''],
      startDate: [''],
      endDate: [''],
    });

    this.filterForm.valueChanges.subscribe(({ status, startDate, endDate }) => {
      const filter: { status?: string; dateRange?: [string, string] } = {};
      if (status) {
        filter.status = status;
      }
      if (startDate && endDate) {
        filter.dateRange = [startDate, endDate];
      }
      this.filterChange.emit(filter);
    });
  }

  clearFilters() {
    this.filterForm.reset({
      status: '',
      startDate: '',
      endDate: '',
    });
    this.filterChange.emit({});
  }
}
