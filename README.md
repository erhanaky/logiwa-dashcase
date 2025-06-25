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

