import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Job } from '../shared/models/job.model';

export interface JobDetail extends Job {
  description: string;
}

@Injectable({ providedIn: 'root' })
export class JobDetailService {
  constructor(private apollo: Apollo) {}

  getJobDetail(id: string): Observable<JobDetail> {
    return this.apollo
      .watchQuery<{ job: JobDetail }>({
        query: gql`
          query GetJob($id: ID!) {
            job(id: $id) {
              id
              sku
              status
              assignedUser
              createdDate
              description
            }
          }
        `,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data.job));
  }
}
