# Progress Checklist

## 0. Planning And Documentation

- [x] Capture original assessment brief.
- [x] Write requirements document with scope and deliberate exclusions.
- [x] Write architecture document with system design and trade-offs.
- [x] Write development plan with build order.
- [x] Add engineering instructions in `CLAUDE.md`.
- [x] Align docs with separate `client/` and `server/` apps.
- [x] Document latest-package requirement.
- [x] Document module-wise client structure.
- [x] Document backend modules, routes, controllers, services, and root route file.
- [x] Commit documentation alignment.

## 1. Project Scaffold

- [x] Create Vite React TypeScript client with latest Vite command.
- [x] Create separate Express TypeScript server app.
- [x] Add root `.gitignore`.
- [x] Add `docker-compose.yml` for local PostgreSQL.
- [x] Add server `GET /api/health`.
- [x] Add server root route file.
- [x] Add server error middleware.
- [x] Add server env parsing.
- [x] Add README quickstart commands.
- [x] Verify client production build.
- [x] Verify server TypeScript build.
- [x] Commit scaffold.

## 2. Client Foundation

- [x] Install Tailwind CSS for Vite.
- [x] Configure `@/*` import alias.
- [x] Initialize shadcn/ui with Base UI.
- [x] Add shadcn `button`.
- [x] Add shadcn `badge`.
- [x] Add shadcn `card`.
- [x] Add shadcn `dialog`.
- [x] Add shadcn `dropdown-menu`.
- [x] Add shadcn `input`.
- [x] Add shadcn `label`.
- [x] Add shadcn `select`.
- [x] Add shadcn `separator`.
- [x] Add shadcn `table`.
- [x] Add shadcn `textarea`.
- [x] Install client app dependencies: TanStack Query, TanStack Table, React Router, Recharts, React Hook Form, Zod, Axios.
- [x] Install client test dependencies.
- [x] Create module-wise client folders.
- [x] Create initial app shell.
- [x] Create initial employee directory preview.
- [x] Wire React Router.
- [x] Wire TanStack Query provider.
- [x] Replace preview directory with API-backed table.
- [x] Add reusable form field wrappers if needed.

## 3. Server Foundation

- [x] Install Express middleware dependencies.
- [x] Install Prisma client and CLI.
- [x] Install server test dependencies.
- [x] Install CSV export dependency.
- [x] Create module-wise server folders.
- [x] Create health module.
- [x] Add Prisma schema.
- [x] Add first migration.
- [x] Add Prisma client helper.
- [x] Add typed application errors.
- [x] Add request validation helpers.
- [x] Add service unit test setup.
- [x] Add API integration test setup.

## 4. Data Layer

- [x] Model `employees`.
- [x] Model `salary_records`.
- [x] Model `fx_rates`.
- [x] Add employee status enum.
- [x] Add directory filter indexes.
- [x] Add salary history indexes.
- [x] Add current salary relationship.
- [x] Add migration.
- [x] Add deterministic seeded random helper.
- [x] Add 10,000 employee seed script.
- [x] Seed realistic countries, departments, currencies, and salaries.
- [x] Seed 1-4 salary records per employee.
- [x] Seed FX rates.
- [x] Verify migration flow.
- [x] Verify seed flow.

## 5. Backend API

- [x] Implement `GET /api/employees`.
- [x] Implement directory pagination.
- [x] Implement directory search.
- [x] Implement country, department, and status filters.
- [x] Implement directory sorting.
- [x] Implement `GET /api/employees/:id`.
- [x] Implement `POST /api/employees`.
- [x] Implement `PATCH /api/employees/:id`.
- [x] Implement `DELETE /api/employees/:id` as soft delete.
- [x] Implement `POST /api/employees/:id/salary`.
- [x] Ensure salary changes are transactional.
- [x] Ensure salary records are append-only.
- [x] Implement `GET /api/fx-rates`.
- [x] Implement `PUT /api/fx-rates`.
- [x] Implement `GET /api/dashboard`.
- [x] Implement median salary query.
- [x] Implement salary distribution buckets.
- [x] Implement country and department breakdowns.
- [x] Implement recent salary changes.
- [x] Implement `GET /api/employees/export`.
- [x] Stream CSV export.

## 6. Backend Tests

- [ ] Test salary-change atomicity.
- [x] Test salary-history immutability.
- [x] Test FX normalization math.
- [x] Test pagination edges.
- [x] Test filter and sort query building.
- [x] Test dashboard median and buckets on known fixtures.
- [x] Test employee API validation failures.
- [x] Test employee API success response shapes.
- [x] Test CSV export filters.

## 7. Frontend Features

- [x] Build employee directory page.
- [x] Add URL-backed directory state.
- [x] Add debounced search.
- [x] Add country filter.
- [x] Add department filter.
- [x] Add status filter.
- [x] Add server pagination controls.
- [x] Add CSV export action.
- [x] Build employee detail page.
- [x] Build salary history timeline.
- [x] Build create employee flow.
- [x] Build edit employee flow.
- [x] Build salary change flow.
- [x] Build dashboard page.
- [x] Add dashboard KPI cards.
- [x] Add salary distribution chart.
- [x] Add country breakdown chart.
- [x] Add department breakdown chart.
- [x] Add recent salary changes panel.
- [x] Build FX rates settings page.

## 8. Frontend Tests

- [x] Test directory filtering interaction.
- [x] Test directory pagination interaction.
- [x] Test salary change form.
- [ ] Test create employee validation.
- [x] Test FX rate editing.

## 9. Performance And Polish

- [x] Verify directory response under 150 ms on 10,000 rows.
- [x] Verify dashboard response under 300 ms on 10,000 rows.
- [ ] Run `EXPLAIN` on key queries.
- [ ] Tune indexes if needed.
- [ ] Review UI for HR manager usability.
- [ ] Verify responsive layouts.
- [ ] Verify empty states.
- [ ] Verify loading states.
- [ ] Verify error states.
- [ ] Finalize README quickstart.
- [ ] Add AI usage notes.
- [ ] Prepare demo script.
- [ ] Record demo video.
- [ ] Deploy app.

## 10. Final Verification

- [ ] Run server tests.
- [ ] Run client tests.
- [ ] Run server build.
- [ ] Run client build.
- [ ] Run lint.
- [ ] Fresh clone setup check.
- [ ] Confirm git history is incremental and readable.
