# Repeating Identical Checkpoints (`CP-0` to `CP-5`)

Instead of taking six different quizzes—where you can never tell if a higher score came from an easier test or real learning—you take the **exact same standardized benchmark ("The 1Z0-171 Benchmark") six times**:

| Checkpoint | Lessons | When You Take It | Answer Key Status | Expected Overall Score |
| :---: | :---: | :--- | :---: | :---: |
| **CP-0** | `L001–L002` | Very start of course (zero knowledge) | Locked | 10–25% |
| **CP-1** | `L041–L042` | After Phase 2 (Foundations, `SELECT`, Filtering, Variables) | Locked | 30–40% |
| **CP-2** | `L081–L082` | After Phase 4 (Functions & Grouping) | Locked | 50–60% |
| **CP-3** | `L121–L122` | After Phase 6 (Joins, Subqueries & `SET` Operators) | Locked | 65–72% |
| **CP-4** | `L161–L162` | After Phase 8 (DML, TCL, DDL, Constraints, Views, Indexes) | Locked | 75–85% |
| **CP-5** | `L199–L200` | End of Phase 10 (Final Readiness) | **Unlocked** | **≥ 85%** |

---

## How Each 90-Minute Checkpoint Works

1. **First 45 Minutes — Take the Benchmark (on GitHub Pages)**:
   - **Part A (22 Fixed Questions)**: 2 identical exam-style questions per each of the 11 `1Z0-171` domains.
   - **Part B (3 Gold Standard SQL Tasks)**:
     1. *Query Task (`SCOTT`)*: Multi-table join (`EMP`, `DEPT`, `SALGRADE`) with `NULL`-safe pay (`NVL(comm, 0)`) and `GROUP BY`/`HAVING`.
     2. *Subquery / Set Task (`HR`)*: Find departments with no employees or employees earning above their department average.
     3. *Schema Task*: Write a `CREATE TABLE` DDL statement with `PRIMARY KEY`, `FOREIGN KEY (ON DELETE SET NULL)`, and `CHECK`.
   - **Part C (Confidence Calibration)**: Rate your confidence (1–5) for each domain *before* seeing your score.
2. **Second 45 Minutes — Delta Review & Reflection**:
   - Inspect your domain-by-domain growth chart in the GitHub Pages Checkpoint Studio.
   - Identify **blind spots** (domains where your confidence was `≥ 4/5` but your score was `< 50%`).
   - Save your 4-question reflection log and export a Markdown/JSON snapshot.

!!! warning "Why Answer Keys Stay Locked Until `CP-5`"
    During `CP-0` through `CP-4`, you see your **per-domain percentage scores** (e.g., *Domain 3: 75%*), not the specific question answers. That ensures your score jumps reflect genuine SQL understanding rather than memorizing 22 answers. At `CP-5` (`L199–L200`), the full answer key and explanations unlock automatically.
