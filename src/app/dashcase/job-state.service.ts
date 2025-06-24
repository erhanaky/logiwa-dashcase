import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Job } from '../shared/models/job.model';

@Injectable({ providedIn: 'root' })
export class JobStateService {
  private _allJobs = new BehaviorSubject<Job[]>([]);
  private _jobs = new BehaviorSubject<Job[]>([]);
  private _selected = new BehaviorSubject<string | null>(null);

  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  readonly jobs$ = this._jobs.asObservable();
  readonly selectedJobId$ = this._selected.asObservable();
  readonly loading$ = this._loading.asObservable();
  readonly error$ = this._error.asObservable();

  constructor(private http: HttpClient) {
    this.loadJobs();
  }

  loadJobs(): void {
    this._loading.next(true);
    this._error.next(null);
    // settimeout network gecikmesini simule etmek icin eklendi
    setTimeout(() => {
      this.http
        .get<Job[]>(`${environment.apiBaseUrl}/jobs`)
        .pipe(
          finalize(() => this._loading.next(false)),
          catchError((err) => {
            console.error('loadJobs error', err);
            this._error.next('İşler yüklenirken bir hata oluştu.');
            return of<Job[]>([]);
          })
        )
        .subscribe((jobs) => {
          this._allJobs.next(jobs);
          this._jobs.next(jobs);
        });
    }, 750);
  }

  applyFilter(filter: { status?: string; dateRange?: [string, string] }): void {
    let list = this._allJobs.getValue();
    if (filter.status) {
      list = list.filter((j) => j.status === filter.status);
    }
    if (filter.dateRange) {
      const [from, to] = filter.dateRange.map((d) => new Date(d));
      list = list.filter((j) => {
        const cd = new Date(j.createdDate);
        return cd >= from && cd <= to;
      });
    }
    this._jobs.next(list);
  }

  selectJob(id: string | null): void {
    this._selected.next(id);
  }

  updateStatus(id: string, status: Job['status']): void {
    const updated = this._jobs
      .getValue()
      .map((j) => (j.id === id ? { ...j, status } : j));
    this._jobs.next(updated);

    this.http
      .patch<Job>(`${environment.apiBaseUrl}/jobs/${id}`, { status })
      .pipe(
        catchError((err) => {
          console.error('updateStatus error', err);
          this.loadJobs();
          return of(null as any);
        })
      )
      .subscribe();
  }
}
