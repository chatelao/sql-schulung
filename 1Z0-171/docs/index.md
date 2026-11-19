# Oracle 1Z0-171 SQL Zero-to-Certified Handbook

Welcome to the official static textbook for the **200-Lesson Beginner Curriculum** preparing you from **zero prior database knowledge** to passing the **Oracle AI Database SQL Associate (1Z0-171)** certification exam.

!!! info "Dual-Platform Learning Model"
    - **You are reading Read the Docs**: Designed for calm, distraction-free reading, printable study guides, ERDs, and SQL syntax reference.
    - **Interactive Companion on GitHub Pages**: Use the [Interactive SQL Learning Studio](https://chatelao.github.io/sql-schulung/) for your **6 Identical Checkpoints (`CP-0`–`CP-5`)**, Join/String visualizers, `sqlplus` substitution simulator, flashcards, and timed 60-question mock exams.

---

## Quick Exam Facts

| Attribute | Specification |
| :--- | :--- |
| **Exam Code** | `1Z0-171` — Oracle AI Database SQL Associate |
| **Database Target** | Oracle AI Database (23ai) |
| **Questions & Format** | 60 Multiple-Choice (including multi-select) |
| **Duration** | 120 Minutes |
| **Passing Score** | **65%** (39 correct answers) |
| **Prerequisites** | None |

---

## How Each 45-Minute Lesson Works

Every single one of the **200 lessons (`L001`–`L200`)** follows the same repeatable 45-minute rhythm:

1. **Warm-Up Recall (5 min)** — Answer 3 quick review prompts on GitHub Pages before looking at notes.
2. **Micro-Concept (10 min)** — Read one focused concept here in Read the Docs.
3. **Guided Live Coding (15 min)** — Run the worked examples on **`SCOTT/TIGER`** (14 employees, 4 departments) first, then **`HR`**.
4. **Independent Practice (12 min)** — Predict the query output *before* hitting Run in your Oracle database.
5. **Exam Trap Takeaway (3 min)** — Note the exact `ORA-` error or edge case tested on `1Z0-171`.

---

## Choose Your Lab Environment

- **[Variant A: In-House Oracle Database](getting-started/variant-a-inhouse.md)** — Local Docker/Podman container (`Oracle Database 23ai Free`) or corporate Pluggable Database with VS Code / SQL Developer & `sqlcl`/`sqlplus`.
- **[Variant B: Free Online Cloud Environment](getting-started/variant-b-online.md)** — Zero-installation browser setup using **Oracle FreeSQL** (`freesql.com`), **OCI Always Free Autonomous Database**, and **db<>fiddle**.

---

## Course Roadmap (10 Phases / 200 Lessons)

| Phase | Lessons | Focus Area | Exam Weight | Checkpoint |
| :---: | :---: | :--- | :---: | :---: |
| **[Phase 1](phases/phase-01-foundations.md)** | `L001`–`L020` | Onboarding, Relational Concepts & Basic `SELECT` | ~10% | **CP-0** (`L001–L002`) |
| **[Phase 2](phases/phase-02-filtering-sorting.md)** | `L021`–`L042` | Filtering (`WHERE`), Sorting & Substitution Variables | ~10% | **CP-1** (`L041–L042`) |
| **[Phase 3](phases/phase-03-functions.md)** | `L043`–`L068` | Single-Row, Conversion & Conditional Functions | ~18% | — |
| **[Phase 4](phases/phase-04-aggregation.md)** | `L069`–`L082` | Group Functions, `GROUP BY` & `HAVING` | ~7% | **CP-2** (`L081–L082`) |
| **[Phase 5](phases/phase-05-joins.md)** | `L083`–`L102` | Multi-Table Joins, Self-Joins & Non-Equijoins | 10% | — |
| **[Phase 6](phases/phase-06-subqueries-set.md)** | `L103`–`L122` | Subqueries & `SET` Operators | 10% | **CP-3** (`L121–L122`) |
| **[Phase 7](phases/phase-07-dml-tcl.md)** | `L123`–`L138` | DML (`INSERT`/`UPDATE`/`DELETE`/`MERGE`) & Transactions | 5% | — |
| **[Phase 8](phases/phase-08-ddl-objects.md)** | `L139`–`L162` | DDL, Constraints, Views, Sequences, Indexes & Synonyms | 20% | **CP-4** (`L161–L162`) |
| **[Phase 9](phases/phase-09-dict-tz-dcl.md)** | `L163`–`L178` | Data Dictionary, Time Zones & User Access (DCL) | 10% | — |
| **[Phase 10](phases/phase-10-exam-prep.md)** | `L179`–`L200` | "Human Compiler" Drills, Mock Exams & Final Readiness | 100% | **CP-5** (`L199–L200`) |
