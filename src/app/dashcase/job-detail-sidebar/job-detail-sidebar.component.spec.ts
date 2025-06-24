import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailSidebarComponent } from './job-detail-sidebar.component';

describe('JobDetailSidebarComponent', () => {
  let component: JobDetailSidebarComponent;
  let fixture: ComponentFixture<JobDetailSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
