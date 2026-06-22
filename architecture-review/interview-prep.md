# Interview Preparation

How to talk about SupportHub in Senior Full‑Stack / System‑Design / tech‑leadership interviews. Each
subsystem has a 2‑minute pitch, a diagram, and curated follow‑ups. The capstone is **20 senior‑level
follow‑up Q&A** at the end.

---

## 0. The 60‑Second Project Pitch

> "SupportHub is a multi‑tenant, white‑label helpdesk SaaS — think a lean Zendesk. Companies register
> and get an isolated workspace on their own subdomain. The core feature is **email‑to‑ticket
> automation**: I connect a company's Gmail or Outlook over OAuth, register a **push subscription**
> (Google Pub/Sub / Microsoft Graph), and inbound mail becomes a deduplicated, threaded **ticket** in
> near‑real‑time. Each new ticket is **classified by Google Gemini** — tags, sentiment, priority — and
> a **rule engine auto‑assigns** it to an agent. The whole thing is **event‑driven**: webhooks ACK
> instantly and push work onto **BullMQ** queues, workers do the slow stuff, and **Socket.IO** streams
> live updates to agent dashboards scoped per workspace. It's a pnpm/Turbo monorepo — Express 5 +
> Prisma + Postgres + Redis on the back end, Next.js 16 on the front. The interesting engineering is in
> the **idempotency** (dedup at the queue and DB layers), **tenant isolation**, and the **graceful
> degradation** of the AI path."

---

## 1. Email‑to‑Ticket Subsystem (your strongest story)

### 2‑Minute Explanation
> "Inbound email is push‑based. On connect I OAuth the mailbox and store the tokens **AES‑256‑GCM
> encrypted**, then register a watch — Gmail via `users.watch` to a Pub/Sub topic, Outlook via a Graph
> subscription. When mail arrives the provider POSTs my webhook. The webhook does **almost nothing**: it
> ACKs 200/202 immediately — because Google and Microsoft retry aggressively if you're slow — and drops
> a job on a BullMQ queue. A worker then fetches the message (Gmail uses an **incremental `historyId`
> cursor**, Outlook gets the message id in the notification), and runs it through a small state machine:
> **dedup** by RFC‑2822 Message‑ID, **thread‑detect** by `References`/`In‑Reply‑To`, **upsert the
> customer**, then either **create a ticket** or **append a reply** (reopening if it was closed). New
> tickets enqueue a **second** job for AI classification. Dedup is belt‑and‑suspenders: a BullMQ `jobId`
> collapses duplicate webhooks, and a DB unique constraint `(messageId, workspaceId)` is the
> authoritative guard."

### Diagram
See the end‑to‑end sequence in [email-ticket-architecture.md](./email-ticket-architecture.md) §4.

### Top follow‑ups
- **Q: Why not poll IMAP?** Push gives near‑real‑time latency at far lower quota cost; polling 1000s of
  inboxes is wasteful and laggy.
- **Q: How do you prevent duplicate tickets?** Two layers — BullMQ `jobId = provider-email-historyId`
  for duplicate deliveries, and `@@unique([messageId, workspaceId])` checked before any write.
- **Q: How are replies linked?** I store an `EmailMessage` row per processed mail; on a new mail I parse
  `In‑Reply‑To` + `References`, look up any matching `messageId` in the same workspace, and attach to
  that ticket (most recent match wins).
- **Q: Webhook is down for an hour — do you lose mail?** Gmail no — the persisted `historyId` lets me
  pull everything since the last cursor. Outlook is weaker: notifications carry the message id with no
  incremental backfill, so I'd add a periodic reconciliation sweep.
- **Q: What if Gemini is down?** Ticket still gets created — classification returns `null`, the ticket
  is untagged/unassigned and lands in the "unassigned" view; I still write an `AIDecisionLog`.

### Common weaknesses (own them)
- `ticketNumber` is `MAX+1` → race under concurrent mail.
- No **attachment** ingestion yet (S3 service exists but isn't wired to email).
- Outlook lacks incremental backfill.

### Improvements
- Postgres sequence per workspace for `ticketNumber`; attachment extraction → S3; Outlook delta query
  reconciliation.

---

## 2. Multi‑Tenant Architecture

### 2‑Minute Explanation
> "It's a **pooled** model — shared database, shared schema, a `workspaceId` discriminator on every
> table. The tenant is the `Workspace`, addressed by subdomain. The crucial design choice is that the
> **authoritative tenant is a signed JWT claim**, not the URL. The subdomain only drives frontend
> routing and theming; data access always uses `workspaceId` from the verified token. Every service
> scopes `where: { workspaceId }`, and for fetch‑by‑id I re‑check `record.workspaceId === user
> .workspaceId` and return **404, not 403**, so I never confirm another tenant's record exists. Even
> the real‑time layer is isolated — sockets auto‑join a `workspace:{id}` room and events only emit
> there."

### Diagram
See [multi-tenant-architecture.md](./multi-tenant-architecture.md) §2–3.

### Top follow‑ups
- **Q: Where's the isolation actually enforced?** Application layer. That's the main risk — one missing
  `where` clause leaks data. I'd add **Postgres RLS** as a backstop and a Prisma extension that
  auto‑injects `workspaceId`.
- **Q: Why share a DB instead of DB‑per‑tenant?** Density and operational simplicity for SMB scale.
  I'd offer a **siloed tier** (schema/DB‑per‑tenant) for enterprise compliance.
- **Q: Can the client spoof a workspace?** No — `workspaceId` is in the signed token; the API never
  reads it from a header or the URL for data queries.

### Weaknesses / Improvements
- No RLS; `User.email` is globally unique so one person can't be an agent in two workspaces (would need
  a `Membership` join). Add RLS + auto‑scoping + membership model.

---

## 3. Authentication & Authorization

### 2‑Minute Explanation
> "Stateless **dual‑token JWT** — a 15‑minute access token and a 7‑day refresh token signed with
> separate secrets, both carrying `{userId, email, workspaceId, role}`. The refresh token is **stored
> on the user row and rotated** on every use: a refresh must verify cryptographically *and* match the DB
> value, so a stolen old refresh token stops working once the real client refreshes. Logout and
> password‑reset null the stored token to kill sessions. Authorization is two‑role RBAC — ADMIN vs AGENT
> — enforced by an `adminOnly` middleware on privileged routes, layered on top of tenant scoping."

### Diagram
See [authentication-architecture.md](./authentication-architecture.md) §4.

### Top follow‑ups
- **Q: Why store the refresh token server‑side if JWTs are stateless?** To get **rotation + revocation**
  — the one piece of state that makes the otherwise‑stateless scheme revocable.
- **Q: Multi‑device?** Today, no — a single `refreshToken` column means a second login invalidates the
  first. I'd move to a `Session` table keyed by device.
- **Q: How do you stop email enumeration?** Login, forgot‑password, and resend‑verification all return
  generic messages and don't distinguish "no user".
- **Q: Access token revocation?** It's not revocable mid‑life (stateless) — mitigated by the 15‑min TTL.

### Weaknesses / Improvements
- Dev‑default JWT secrets with no fail‑fast; no login rate‑limit/lockout; inconsistent password policy
  (strong on reset, weak on register); mixed RBAC enforcement (middleware vs inline in invitations).
  Add boot‑time secret validation, login throttling, a `requireRole` factory, and a `Session` model.

---

## 4. Real‑Time (Socket.IO)

### 2‑Minute Explanation
> "Socket.IO shares the API's HTTP server. The handshake reuses the **access JWT**; on connect the
> socket joins exactly one room — `workspace:{id}` — which is the tenant boundary. Workers emit ticket
> events (`created/reply/updated/tagged/assigned`) to that room. On the client, every event triggers a
> **React Query invalidation**, so the UI re‑fetches authoritative state rather than trusting the event
> payload — which means a dropped event during a disconnect self‑heals on the next event."

### Top follow‑ups
- **Q: How does this scale horizontally?** It doesn't yet — rooms are in‑process. The fix is the
  **`@socket.io/redis-adapter`** (Redis is already in the stack) plus sticky sessions.
- **Q: Presence / typing indicators?** Not implemented — only connect/disconnect logging. Would add a
  presence map in Redis.
- **Q: Guaranteed delivery?** No replay; acceptable because events drive refetch. For guarantees I'd add
  an event outbox + cursor.

---

## 5. Background Jobs (BullMQ)

### 2‑Minute Explanation
> "Two Redis‑backed BullMQ queues with separate tuning: `email-processing` (concurrency 5, 20/min,
> backoff 5/10/20s) and `ai-classification` (concurrency 3, 15/min, backoff 3/6/12s). Splitting them
> means Gemini latency never stalls email ingestion. Jobs are **idempotent by design** —
> deterministic `jobId`s plus DB unique constraints make retries safe. Failed jobs are retained (5000)
> as a de‑facto dead‑letter store. A node‑cron every 6h renews Gmail watches (<48h), Outlook
> subscriptions (<12h), and refreshes OAuth tokens (<10m)."

### Top follow‑ups
- **Q: Where do retries go after exhaustion?** They stay in BullMQ's failed set (retained for
  inspection) — there's no auto re‑drive or alerting yet; I'd add Bull Board + alerts.
- **Q: Run two API instances — what breaks?** The in‑process cron fires on each → duplicate renewals.
  Fix with leader election or BullMQ repeatable jobs; and split workers into their own deployment.
- **Q: How do you avoid double‑processing on retry?** `EmailMessage` uniqueness makes re‑ingest a no‑op;
  `classify-{ticketId}` bounds re‑classification.

---

## 6. AI Classification & Assignment Engine

### 2‑Minute Explanation
> "A worker sends the subject+body to **`gemini-2.0-flash`** with a prompt that injects the workspace's
> **controlled tag vocabulary** and a JSON schema, with a 15s timeout. I **validate the output** — drop
> hallucinated tags, clamp confidence, default bad priorities — so the model can only return labels that
> exist. Tags at **≥0.70 confidence auto‑apply**; below that they become **pending suggestions** an
> agent reviews. Then a **rule engine** runs: admin‑defined rules ordered by priority, first match wins,
> with AND/OR tag conditions, and either a specific assignee or least‑loaded round‑robin. Every decision
> is written to an immutable **`AIDecisionLog`** with the raw response, timings, and which rule fired."

### Top follow‑ups
- **Q: How do you stop the LLM inventing tags?** Output validation against the seeded `SYSTEM_TAGS`
  vocabulary — unknown tags are discarded before anything is written.
- **Q: Confidence threshold rationale?** ≥0.70 auto‑apply keeps precision high; lower‑confidence labels
  go to a human review queue instead of polluting the ticket.
- **Q: Is round‑robin fair?** It's "least open tickets", tie‑broken by array order — not a true rotation;
  I'd persist a pointer or use load + last‑assigned time.

### Weaknesses / Improvements
- `flagUrgent` is currently a no‑op; round‑robin tie‑breaking; no per‑tenant Gemini quota; tag vocab is
  code‑seeded (no custom tags without deploy). Apply `flagUrgent`, add quotas, allow custom tags.

---

## 7. Database & Search

### 2‑Minute Explanation
> "Postgres via Prisma 7's pg driver adapter, UUID PKs everywhere for tenant safety, 11 models all
> hanging off `Workspace`. Uniqueness constraints do real work — `(messageId, workspaceId)` is my email
> dedup, `(ticketNumber, workspaceId)` is the human‑friendly sequence, `(email, workspaceId)` lets me
> upsert customers from inbound mail. The honest gaps are **missing composite indexes** on ticket hot
> paths and **search being `ILIKE`** — fine at MVP scale, but the first things I'd fix with FTS and
> covering indexes."

### Top follow‑ups
- **Q: Biggest DB risk?** No secondary indexes on `Ticket(workspaceId,status,updatedAt)` etc. → seq
  scans as data grows. Plus the `ticketNumber` race.
- **Q: How would you scale search?** Postgres FTS (`tsvector`+GIN) first, then Meilisearch/Elastic with
  per‑workspace indexes for relevance and typo tolerance.

---

## Capstone: Top 20 Senior‑Level Follow‑Up Questions

1. **Walk me through what happens from "customer hits send" to "agent sees the ticket."**
   → Provider push → webhook ACKs + enqueues → email worker fetches + dedups + threads + creates ticket
   → enqueues AI job → Socket.IO emits to the workspace room → client refetches. ~2–5s typical. (See
   system‑architecture §5.)

2. **Your webhook receives a duplicate notification. What prevents a duplicate ticket?**
   → BullMQ `jobId` dedup at enqueue + `@@unique([messageId, workspaceId])` checked before insert.

3. **Two emails to the same new customer arrive simultaneously. Any bug?**
   → Yes — `ticketNumber = MAX+1` is non‑atomic; one insert hits the unique constraint (P2002). BullMQ
   retries and self‑corrects, but it can gap numbers. Fix: Postgres sequence or `$transaction`+retry.

4. **How is tenant data isolated, and what's the weak point?**
   → Shared schema + `workspaceId` from a signed JWT; scoped queries + 404‑on‑mismatch. Weak point:
   application‑level enforcement — one missing `where` leaks data. Backstop with Postgres RLS.

5. **Why two BullMQ queues instead of one?**
   → Isolate slow, rate‑limited Gemini work from fast email ingestion; independent retry/concurrency.

6. **Gemini returns garbage or times out. What's the user impact?**
   → None to ingestion — classification returns `null`, the ticket is created untagged/unassigned, and
   an `AIDecisionLog` is still recorded. Graceful degradation.

7. **How do you stop the LLM from hallucinating tags or priorities?**
   → Validate output against the seeded vocabulary, clamp confidence to [0,1], default invalid priority
   to MEDIUM. Only known labels are persisted.

8. **A refresh token is stolen. What happens?**
   → It works until the legitimate client refreshes; rotation replaces the stored token, so the
   attacker's next refresh fails (DB mismatch). Foundation for reuse detection. Access tokens expire in
   15 min regardless.

9. **You need to run 3 API instances. What breaks first?**
   → (a) Socket.IO in‑memory rooms — emits won't cross instances → add the Redis adapter + sticky
   sessions. (b) node‑cron fires on every instance → leader election / repeatable jobs.

10. **How would you make real‑time horizontally scalable?**
    → `@socket.io/redis-adapter` (Redis already present), sticky sessions at the LB, and emit via the
    adapter so worker processes on other hosts can reach connected sockets.

11. **Ticket list is slow at 10M rows. Diagnose.**
    → Missing composite index for `where workspaceId+status order by updatedAt`. Add
    `@@index([workspaceId,status,updatedAt])`; consider keyset pagination over offset.

12. **How do reports scale, and what's wrong today?**
    → Today some metrics aggregate in JS (pull rows → reduce). Move to SQL (`AVG`, `date_trunc`
    group‑by) + indexes, serve from a read replica, and pre‑compute rollups at high volume.

13. **Where are OAuth tokens stored and how are they protected?**
    → On `EmailAccount` as AES‑256‑GCM ciphertext (`iv:authTag:ciphertext`), key from `ENCRYPTION_KEY`.
    Refreshed proactively by cron and lazily before API calls.

14. **How do you handle provider watch/subscription expiry?**
    → A 6‑hour cron re‑arms Gmail watches (<48h to expiry) and Outlook subscriptions (<12h), and
    refreshes tokens (<10m). Buffers chosen for redundancy across cron ticks.

15. **What's your idempotency story across the whole pipeline?**
    → Deterministic `jobId`s (`provider-email-historyId`, `classify-ticketId`) + DB unique constraints
    (`messageId`, `ticketNumber`, `TagSuggestion (workspace,tag,ticket)`) + idempotent state updates
    (`updateMany ... where status=PENDING`).

16. **How does authorization differ from tenancy here?**
    → Tenancy = *which rows* (`workspaceId` claim). Authorization = *what actions* (ADMIN vs AGENT via
    `adminOnly`). Both must pass. AGENTs currently can act on any ticket in the workspace.

17. **A workspace has a noisy tenant flooding email. Blast radius?**
    → Shared DB + global queue rate limits + global Gemini quota → it can starve others. Fix with
    per‑tenant queues/quotas and rate limits.

18. **What happens on `uncaughtException`?**
    → Logged as fatal and `process.exit(1)` — relies on the orchestrator to restart. Because workers +
    sockets + cron share the process, they all restart together; this argues for splitting workers out.

19. **Manual ticket update — does the dashboard update live?**
    → Not via socket today (only the email/AI path emits events); manual changes rely on React Query
    refetch. I'd add `emitTicketEvent` to the manual mutation services for parity.

20. **If you had one week, what would you fix first and why?**
    → (1) Composite indexes + atomic `ticketNumber` (correctness + perf at the lowest cost), (2)
    Socket.IO Redis adapter + split workers (unblocks horizontal scaling cheaply since Redis exists),
    (3) Postgres RLS (closes the biggest isolation risk). Then wire invitation emails, attachments, and
    `flagUrgent` (small but visible product gaps).

---

## Common Weaknesses Cheat‑Sheet (be the one who names them first)

| Area | Weakness | One‑line fix |
|------|----------|--------------|
| DB | No composite indexes; `ticketNumber` race | Add indexes; Postgres sequence |
| Tenancy | App‑only isolation, no RLS | Add RLS + auto‑scoped Prisma |
| Realtime | In‑memory rooms, single process | Redis adapter + sticky sessions |
| Jobs | In‑process workers + cron; no DLQ alerting | Split workers; leader cron; Bull Board |
| Auth | Dev secrets, no login throttle, single session | Fail‑fast secrets; rate limit; Session table |
| Search | `ILIKE`, no ranking | Postgres FTS → Meilisearch |
| AI | `flagUrgent` no‑op; weak round‑robin | Apply flag; better RR |
| Email | No attachments; Outlook no backfill | S3 attachments; delta reconciliation |
| Product | Invitation email is a `console.log` TODO | Wire the existing SMTP service |
| Notifications | Transient only, no persistence | Add `Notification` model |

> **Interview meta‑tip:** the strongest signal you can give is naming these weaknesses *before* the
> interviewer does, with the cost/leverage trade‑off for each fix. That demonstrates ownership and
> senior judgment far more than a flawless‑sounding system.
</content>
