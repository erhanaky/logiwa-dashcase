# Logiwa Dashcase

**Warehouse Dashboard** – Angular (v19.2 standalone) + Bootstrap + RxJS + Apollo/GraphQL

A fulfillment‐platform “Warehouse Dashboard” module: list active jobs, filter by status/date, view/edit details in a sidebar.

---

## 🛠️ Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/logiwa-dashcase.git
   cd logiwa-dashcase

2. **Install dependencies**  
   ```bash
   npm install

3. **Start mock servers**  
   - **REST** (json-server):  
     ```bash
     npm run mock:rest
     ```
     serves http://localhost:3000/jobs
     
   - **GraphQL** (Apollo mock):  
     ```bash
     npm run mock:graphql
     ```
     serves http://localhost:4000/
     
4. **Run the Angular app**  
   ```bash
   ng serve --open
  * Opens at http://localhost:4200
  * Uses SSR hydration by default; job-list & sidebar skip hydration for smooth loading spinners.

5. **Code quality & pre-commit checks**  
   - **ESLint + Prettier** via `npx lint-staged` + Husky  
   - To manually lint & format:
    
     ```bash
     npm run lint:fix
     npm run format
     ```
     
6. **Unit tests & coverage**  
   ```bash
   ng test --code-coverage
   ```
   Coverage report in coverage/index.html

---
   
## 🏛️ Architecture & Design

### Standalone Components

```ts
// Bootstrapping the application
bootstrapApplication(AppComponent, appConfig);
```
- DashcaseComponent
- JobListComponent
- JobFilterComponent
- JobDetailSidebarComponent

### State Management  
```ts
// job-state.service.ts
@Injectable({ providedIn: 'root' })
export class JobStateService {
  // Observable state streams
  jobs$            = new BehaviorSubject<Job[]>([]);
  loading$         = new BehaviorSubject<boolean>(false);
  error$           = new BehaviorSubject<string|null>(null);
  selectedJobId$   = new BehaviorSubject<string|null>(null);

  // Loads job list via REST
  loadJobs(): void { /* … */ }

  // Applies filters with a loading indicator
  applyFilterWithLoading(filter: Filter): void { /* … */ }

  // Sets the currently selected job ID
  selectJob(id: string): void { /* … */ }

  // Updates job status (optimistic UI + REST)
  updateStatus(id: string, status: JobStatus): void { /* … */ }
}
```
- Uses RxJS `BehaviorSubject` for state.
- Provides methods for loading, filtering, selecting, and updating jobs.

### API Integration  
**REST API** for listing jobs and updating status (using `json-server`):  
  ```bash
  # GET job list
  GET http://localhost:3000/jobs

  # PATCH update status
  PATCH http://localhost:3000/jobs/:id
  Body: { "status": "Completed" }
  ```
  - **GraphQL API** for fetching job details (using Apollo mock server).
  - **Apollo Client fetch policy** to always retrieve fresh data after updates.

### Hydration Handling  
**Global hydration support**  
  ```ts
  import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideClientHydration(withEventReplay()),
      // other providers...
    ]
  };
  ```
- **Skip hydration** on components where SSR/Client mismatch may occur:

  ```ts
  // Prevent hydration on this component
  <app-job-list ngSkipHydration></app-job-list>
  ```
  
### Loading & Error UX  
**Loading indicator**  
  ```html
  <div *ngIf="loading$ | async" class="text-center my-3">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
 ```
**Error message**  
  ```ts
 <div *ngIf="error$ | async as err" class="alert alert-danger" role="alert">
   {{ err }}
 </div>
 ```
**Empty state**  
  ```ts
 <tr *ngIf="(jobs$ | async)?.length === 0">
   <td colspan="5" class="text-center text-muted">
     No jobs match the selected criteria.
   </td>
 </tr>
 ```

### Code Quality  
- **ESLint** with `@angular-eslint` & `eslint-plugin-prettier`  
- **Prettier** configuration (`.prettierrc`):

  ```json
  {
    "singleQuote": true,
    "printWidth": 120,
    "trailingComma": "all",
    "endOfLine": "lf"
  }
  ```

- **Husky + lint-staged** pre-commit hooks:

  ```jsonc
  // package.json
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint --ext .ts --fix src/",
    "format": "prettier --write \"src/**/*.{ts,html,scss}\""
  },
  "lint-staged": {
    "src/**/*.{ts,html,scss}": [
      "npx eslint --fix",
      "npx prettier --write"
    ]
  }
  ```

- **Pre-commit** hook (.husky/pre-commit):

  ```bash
  #!/usr/bin/env bash
  . "$(dirname "$0")/_/husky.sh"
  npx lint-staged
  ```
  
### Testing  
**Unit tests** with Karma & Jasmine  
  ```bash
  # Run all unit tests and generate coverage report
  ng test --code-coverage
  ```

- **Asynchronous helpers**

  ```ts
  import { fakeAsync, tick } from '@angular/core/testing';
  
  it('should load detail on input change', fakeAsync(() => {
    component.jobId = '1';
    component.ngOnChanges({
      jobId: new SimpleChange(null, '1', false)
    });
    tick(1500);                // advance the 1.5s timeout
    expect(service.getJobDetail).toHaveBeenCalledWith('1');
  }));
  ```

- **Coverage thresholds** (in `karma.conf.js`):

  ```js
  coverageReporter: {
    check: {
      global: {
        statements: 80,
        branches:   70,
        functions: 80,
        lines:     80
      }
    }
  }
  ```

- **Running tests in CI**

  ```bash
  # Non-interactive mode
  ng test --watch=false --browsers=ChromeHeadless
  ```

---
   
## ⚠️ Limitations & Mocked Areas
- **Mock APIs:** `json-server` & Apollo mock—no real backend
- **Pagination & Auth:** not implemented
- **Accessibility:** basic ARIA & keyboard support; needs audit
- **PWA / Offline:** service worker not configured
- **Test Coverage:** ~40%, needs more tests to reach 80%+
- **Global Error Handling:** no custom `ErrorHandler`

---
   
## 📂 Project Structure
  ```text
  src/
  ├── app/
  │   ├── dashcase/
  │   │   ├── job-list/
  │   │   ├── job-filter/
  │   │   ├── job-detail-sidebar/
  │   │   ├── job-state.service.ts
  │   │   └── dashcase.component.ts
  │   ├── app.component.ts
  │   ├── app.config.ts
  │   └── app.routes.ts
  ├── assets/
  ├── environments/
  ├── styles.scss     ← global theme & overrides
  └── main.ts
  ```
