import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../shared/models/job.model';

export interface JobDetail extends Job {
  description: string;
}

@Injectable({ providedIn: 'root' })
export class JobDetailService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
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
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result: { data: { job: JobDetail } }) => result.data.job)
      );
  }
}
