# Curriculum: 200-Lesson Zero-to-Exam-Readiness Plan for Oracle AI Database SQL Associate (1Z0-171)

This curriculum is designed for **true beginners** (no prior SQL, database, or programming background) and spans **200 lessons of 45 minutes each (150 clock hours total)**. It combines gentle, spiral-based instruction with **repeating identical progress checkpoints**, dual lab environments (**In-House Oracle Database** vs. **Free Online Cloud**), and a dual publishing model (**Read the Docs** for static readable reference material and **GitHub Pages** for interactive exercises and self-assessments).

---

## 1. Target Audience & 45-Minute Lesson Anatomy

### Designed for Real Beginners
- **Zero Assumptions**: Starts from spreadsheets vs. tables, what a primary key is, and how to read a syntax error without panicking.
- **Concrete Before Abstract**: Every new concept is introduced first on the tiny, human-verifiable 14-row **`SCOTT/TIGER`** schema (`EMP`, `DEPT`, `SALGRADE`, `BONUS`) before scaling up to the larger `HR`, `CO`, and `SH` schemas.
- **High Repetition & Retrieval Practice**: Core query patterns are revisited every phase, transitioning gradually from guided typing -> fill-in-the-blank -> independent query writing -> reading SQL without an IDE ("Human Compiler" exam skill).

### Standard 45-Minute Lesson Blueprint
| Segment | Duration | Activity | Platform |
| :--- | :---: | :--- | :--- |
| **1. Warm-Up Recall** | 5 min | 3 quick flashcards or 1 syntax-spotter from the previous lesson | **GitHub Pages** |
| **2. Micro-Concept** | 10 min | One focused concept explained with a visual diagram & plain-language analogy | **Read the Docs** |
| **3. Guided Live Coding** | 15 min | Instructor/learner runs 2–3 examples side-by-side (`SCOTT` / `HR`) | **Oracle DB (Variant A / B)** |
| **4. Independent Practice** | 12 min | 2–4 graded micro-tasks (predict output first, then run to verify) | **GitHub Pages + Oracle DB** |
| **5. Takeaway & Pitfall** | 3 min | Log 1 "Exam Trap" in personal cheat sheet | **Read the Docs / Notes** |

---

## 2. Publishing Architecture: Read the Docs vs. GitHub Pages

The training repository is designed to publish automatically to two complementary platforms from the same Markdown/source tree:

| Platform | Role | Content Published | Technology |
| :--- | :--- | :--- | :--- |
| **Read the Docs** | **Static, Readable Material** | Textbook chapters for all 200 lessons, printable PDF/EPUB study guides, SQL syntax cheat sheets, ERD diagrams (`SCOTT` & `HR`), glossary, ORA-error dictionary, and exam-pitfall summaries. | MkDocs Material or Sphinx (MyST Markdown) |
| **GitHub Pages** | **Interactive Practice & Tracking** | Interactive "Human Compiler" syntax-error drills, drag-and-drop ERD & Join visualizers, flashcards, timed 1Z0-171 mock exam simulator, **Identical Checkpoint** runner with browser `localStorage` longitudinal progress charts & JSON reflection export, and one-click "Copy to FreeSQL / SQLcl" code blocks. | Static HTML/CSS/JS (deployed via GitHub Actions) |

### Suggested Repository Layout
```text
1Z0-171/
├── README.md                  # Exam overview & syllabus weights
├── CURRICULUM.md              # This 200-lesson master plan
├── docs/                      # -> Published to Read the Docs (static readable handbook)
│   ├── phase-01-foundations/
│   ├── ...
│   ├── phase-10-exam-prep/
│   ├── schemas/               # SCOTT/TIGER & HR ERDs, setup scripts
│   └── cheatsheets/           # Printable syntax & ORA-error guides
└── interactive/               # -> Published to GitHub Pages (interactive web apps)
    ├── checkpoints/           # Identical Checkpoint runner & progress chart
    ├── drills/                # Flashcards, Join/SET visualizers, Human Compiler
    └── mock-exams/            # 60-question / 120-min timed 1Z0-171 exam simulator
```

---

## 3. Lab Environment Variants (Both Include `SCOTT/TIGER`)

### Comparison at a Glance

| Dimension | Variant A: In-House Oracle Database | Variant B: Free Online Environment |
| :--- | :--- | :--- |
| **Primary Platform** | On-Premises / Containerized **Oracle Database 23ai Free** (`container-registry.oracle.com/database/free:latest`) or Corporate PDB | **Oracle FreeSQL** ([freesql.com](https://freesql.com/) / [livesql.oracle.com](https://livesql.oracle.com/)) + **OCI Always Free Autonomous Database (23ai)** |
| **Client Tooling** | VS Code (Oracle SQL Developer Extension), Oracle SQL Developer, and `sqlplus` / `sqlcl` CLI | Built-in Browser Worksheet (FreeSQL / Database Actions Web) or optional external SQL*Net connection |
| **Setup Time** | 15–30 minutes (Docker/Podman or IT-provisioned PDB) | 0 minutes (FreeSQL works immediately in browser; OCI Always Free takes ~5 minutes) |
| **Sample Schemas** | Classic **`SCOTT/TIGER`** (`EMP`, `DEPT`, `SALGRADE`, `BONUS`) + official `db-sample-schemas-23ai` (`HR`, `CO`, `SH`) | Pre-loaded read-only schemas (`SCOTT`, `HR`, `SH`, `CO`) in FreeSQL + personal writable schema (with `SCOTT` DDL script for DML labs) |
| **Coverage of 1Z0-171 Topics** | **100%** (multi-user DCL, `&`/`&&`, `DEFINE`/`VERIFY`, external tables, two-session locking) | **~90% on FreeSQL alone**; **100%** when paired with OCI Always Free + GitHub Pages `sqlplus` simulator |

### Variant A: In-House Oracle Database Setup
1. **Database Engine**:
   - **Classroom Server**: Provision one Pluggable Database (`PDB_TRAINING`) on an internal Oracle Database 23ai (or 19c+) server with one schema per learner (`STUDENT_01` .. `STUDENT_N`) plus a peer account (`STUDENT_01_PEER`) for `GRANT`/`REVOKE` labs.
   - **Local Container**:
     ```bash
     docker run -d --name oracle23ai -p 1521:1521 -e ORACLE_PWD=Welcome123! \
       container-registry.oracle.com/database/free:latest
     ```
2. **Client Tools**:
   - **GUI**: VS Code with the **Oracle SQL Developer Extension** (or classic Oracle SQL Developer).
   - **CLI**: **`sqlcl` or `sqlplus`** for substitution variables (`&`, `&&`, `DEFINE`, `VERIFY`) and transaction scripts.
3. **Sample Schemas**:
   - **Classic `SCOTT/TIGER`**: Install `EMP`, `DEPT`, `SALGRADE`, and `BONUS` (historically via `$ORACLE_HOME/rdbms/admin/utlsampl.sql` with `scott`/`tiger`). Ideal for beginners because all 14 employees and 4 departments fit on one screen.
   - **Modern Schemas**: Load the official [Oracle Database Sample Schemas (`HR`, `CO`, `SH`)](https://github.com/oracle-samples/db-sample-schemas).

### Variant B: Free Online Environment Setup (Zero Installation)
1. **Primary Daily Sandbox — Oracle FreeSQL (Live SQL v2)**:
   - **URL**: [https://freesql.com/](https://freesql.com/) (or [https://livesql.oracle.com/](https://livesql.oracle.com/))
   - Runs on **Oracle Database 23ai**, 100% free in the browser, includes pre-loaded `SCOTT`, `HR`, `SH`, and `CO` schemas, plus a personal writable schema and optional SQL*Net access.
2. **Complementary Cloud Lab — OCI Always Free Autonomous Database (23ai)**:
   - **URL**: [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
   - Provides 2 Always Free Oracle 23ai Autonomous Databases with **Database Actions (SQL Developer Web)** in the browser. Used in Phase 7 & Phase 9 for multi-session locking and multi-user `GRANT`/`REVOKE`/`ROLE` labs.
3. **Quick Scratchpad — db<>fiddle**:
   - **URL**: [https://dbfiddle.uk/?rdbms=oracle_23](https://dbfiddle.uk/?rdbms=oracle_23) — Zero-login Oracle 23ai scratchpad for shareable debugging links.

> [!IMPORTANT]
> **Variant B Bridging via GitHub Pages**: Browser worksheets handle `sqlplus` substitution variables (`&`, `&&`, `DEFINE`, `VERIFY`) and `EXTERNAL TABLES` differently from the CLI. In Phase 2 and Phase 8, Variant B learners use a dedicated interactive `sqlplus` simulator on **GitHub Pages** plus annotated spool transcripts on **Read the Docs**.

---

## 4. Repeating Identical Checkpoints (Longitudinal Assessment & Reflection)

To make progress unmistakably visible to beginners, learners take the **exact same standardized checkpoint ("The 1Z0-171 Benchmark") six times** across the 200 lessons:

- **CP-0 (Baseline)**: `L001–L002` — Zero-knowledge starting point (no pressure; guessing is expected)
- **CP-1**: `L041–L042` — After Foundations, `SELECT`, Filtering, Sorting & Variables
- **CP-2**: `L081–L082` — After Functions & Aggregations
- **CP-3**: `L121–L122` — After Joins, Subqueries & `SET` Operators
- **CP-4**: `L161–L162` — After DML, Transactions, DDL, Constraints, Views & Indexes
- **CP-5 (Final)**: `L199–L200` — End-of-course mastery & certification sign-off

### Structure of Each 2-Lesson Checkpoint (90 Minutes)
1. **Lesson 1 (45 min) — The Identical Assessment (Hosted on GitHub Pages)**:
   - **Part A — 22 Exam-Style Questions (25 min)**: 2 identical questions per each of the 11 exam domains (fixed question bank, never shown with answer keys until `CP-5`, only domain-level percentage scores are revealed after `CP-0` through `CP-4` to prevent rote memorization).
   - **Part B — 3 "Gold Standard" SQL Tasks (15 min)**:
     1. *Query Task (`SCOTT`)*: Join `EMP`, `DEPT`, and `SALGRADE` with `NULL`-safe compensation math and `GROUP BY`/`HAVING`.
     2. *Subquery / Set Task (`HR`)*: Find departments without employees or employees earning above their department average.
     3. *Schema Task*: Write a `CREATE TABLE` statement with `PRIMARY KEY`, `FOREIGN KEY (ON DELETE SET NULL)`, and `CHECK` constraint.
   - **Part C — Confidence Rating (5 min)**: Learner rates confidence (1–5) per domain before seeing their domain scores.
2. **Lesson 2 (45 min) — Structured Reflection & Delta Review**:
   - The **GitHub Pages Checkpoint Dashboard** plots the learner's current attempt overlaid on all previous attempts (`CP-0` -> `CP-N`) by domain score, completion time, and confidence calibration.
   - Learners fill out a 4-question reflection log (saved locally / exported as Markdown or JSON):
     1. *Which 2 domains jumped the most since the last checkpoint, and what clicked?*
     2. *Where was my confidence high, yet my score low (blind spots / exam traps)?*
     3. *Which Part B task felt noticeably faster or easier to write from memory?*
     4. *What is my concrete focus goal before the next checkpoint?*

### Expected Beginner Progression Curve
| Checkpoint | Lesson | Expected Overall Score | Expected Confidence | Pedagogical Meaning |
| :---: | :---: | :---: | :---: | :--- |
| **CP-0** | `L001–L002` | 10–25% | Very Low (1/5) | Honest baseline; demystifies what the final exam looks like. |
| **CP-1** | `L041–L042` | 30–40% | Low–Medium (2/5) | Domains 1–2 mastered; learner can now *read* SQL questions even on unseen topics. |
| **CP-2** | `L081–L082` | 50–60% | Medium (3/5) | Domain 3 (25% weight) unlocks a huge score jump; major morale boost. |
| **CP-3** | `L121–L122` | 65–72% | Medium–High (3.5/5) | Crossing the 65% exam pass mark for the first time! |
| **CP-4** | `L161–L162` | 75–85% | High (4/5) | Full query + DDL/DML fluency; only Dictionary/Timezones/DCL remain. |
| **CP-5** | `L199–L200` | **≥ 85%** | Exam-Ready (4.5–5/5) | Complete mastery; full answer key unlocked for final debrief. |

---

## 5. Master 200-Lesson Overview & Pacing Options

### Delivery Schedule Options
- **Full-Time Bootcamp (5 Weeks)**: 8 lessons/day (6 clock hours/day), 5 days/week -> 40 lessons/week.
- **Part-Time Evening / Vocational Track (20 Weeks)**: 10 lessons/week (e.g., 2 evenings × 3 lessons + Saturday × 4 lessons).
- **Academic / School Year Track (1 Year / ~34 Weeks)**: 6 lessons/week.

### Phase Summary (Exactly 200 Lessons = 150 Hours)
| Phase | Title | Lessons | Count | Exam Domains | Weight | Checkpoint |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: |
| **1** | Onboarding, Baseline & Relational Foundations | `L001`–`L020` | 20 | Domain 1, Domain 2 (Pt 1) | ~10% | **CP-0** (`L001–L002`) |
| **2** | Filtering, Sorting & Substitution Variables | `L021`–`L042` | 22 | Domain 2 (Pt 2) | ~10% | **CP-1** (`L041–L042`) |
| **3** | Single-Row, Conversion & Conditional Functions | `L043`–`L068` | 26 | Domain 3 (Pt 1) | ~18% | — |
| **4** | Grouping & Aggregating Data | `L069`–`L082` | 14 | Domain 3 (Pt 2) | ~7% | **CP-2** (`L081–L082`) |
| **5** | Displaying Data from Multiple Tables (Joins) | `L083`–`L102` | 20 | Domain 4 | 10% | — |
| **6** | Subqueries & Compound Queries (`SET` Operators) | `L103`–`L122` | 20 | Domain 5, Domain 6 | 10% | **CP-3** (`L121–L122`) |
| **7** | Data Manipulation (DML) & Transactions (TCL) | `L123`–`L138` | 16 | Domain 7 | 5% | — |
| **8** | DDL, Constraints, Views, Sequences, Indexes & Synonyms | `L139`–`L162` | 24 | Domain 8, Domain 9 | 20% | **CP-4** (`L161–L162`) |
| **9** | Data Dictionary, Time Zones & User Access (DCL) | `L163`–`L178` | 16 | Domain 10, Domain 11 | 10% | — |
| **10** | Exam Mastery, Mock Exams & Final Readiness | `L179`–`L200` | 22 | All 11 Domains | 100% | **CP-5** (`L199–L200`) |
| | **TOTAL** | **`L001`–`L200`** | **200** | **All 11 Domains** | **100%** | **6 Identical CPs** |

---

## 6. Detailed Phase-by-Phase Syllabus (`L001`–`L200`)

### Phase 1: Onboarding, Baseline & Relational Foundations (`L001`–`L020` | 20 Lessons)
* **Beginner Goal**: Demystify databases, get every learner comfortably running queries, and eliminate fear of syntax errors.
* **Lesson Breakdown**:
  - `L001–L002`: **Course Kickoff & Identical Checkpoint #0 (Baseline)** — Introduce the 200-lesson roadmap, run `CP-0` on GitHub Pages, and normalize not knowing the answers yet.
  - `L003–L005`: **From Spreadsheets to Relational Tables** — Why Excel breaks down; tables, rows (tuples), columns (attributes), Primary Keys, and Foreign Keys illustrated using `SCOTT.DEPT` (4 rows) and `SCOTT.EMP` (14 rows).
  - `L006–L008`: **Reading ERDs & SQL Statement Families** — Crow's foot notation (`1:1`, `1:M`, `M:N`), mapping ERD entities to `SELECT` clauses, and distinguishing DML, DDL, DCL, and TCL.
  - `L009–L012`: **Lab Environment Setup & First Queries** —
    - *Variant A*: Connect via VS Code / SQL Developer & `sqlcl` to local/in-house Oracle 23ai (`scott/tiger` and `HR`).
    - *Variant B*: Create free account on [freesql.com](https://freesql.com/), explore built-in `SCOTT` and `HR` schemas.
    - Run `SELECT * FROM scott.dept;` and `DESCRIBE scott.emp;`, learn how to read an `ORA-` error message calmly.
  - `L013–L016`: **Projections, Arithmetic & `NULL` Fundamentals** — Selecting specific columns, operator precedence (`*`, `/`, `+`, `-`, parentheses), and why `sal + comm` produces `NULL` when `comm` is empty.
  - `L017–L020`: **Aliases, Concatenation, Literals, `DISTINCT` & `DUAL`** — `AS` vs. `"Double Quotes"` vs. `'Single Quotes'`, string concatenation (`||`), alternative quote operator (`q'[...]'`), `DISTINCT` across multiple columns, and `DUAL` (plus 23ai optional `FROM`).
* **Publishing Split**:
  - *Read the Docs*: Illustrated "Spreadsheet-to-SQL" guide, `SCOTT` & `HR` printable ERDs, and `ORA-00904`/`ORA-00942` beginner troubleshooting sheet.
  - *GitHub Pages*: Interactive `CP-0` runner, ERD-to-Table matching game, and Alias-Quoting flashcard drill.

---

### Phase 2: Filtering, Sorting & Substitution Variables (`L021`–`L042` | 22 Lessons)
* **Beginner Goal**: Ask precise questions of data and control output order and row count.
* **Lesson Breakdown**:
  - `L021–L024`: **The `WHERE` Clause & Basic Comparisons** — `=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`; case-sensitivity of string values vs. case-insensitivity of SQL keywords; date literals (`DATE '1981-02-20'`).
  - `L025–L028`: **Range, List, Pattern & Null Filters** — `BETWEEN ... AND ...` (inclusive bounds), `IN (...)`, `LIKE` (`%`, `_`, and `ESCAPE '\'`), and why `WHERE comm = NULL` silently returns 0 rows (`IS NULL` / `IS NOT NULL`).
  - `L029–L033`: **Boolean Logic & Precedence Drills** — `AND`, `OR`, `NOT`; truth tables with `NULL` (3-valued logic); operator precedence (`NOT` -> `AND` -> `OR`) and defensive parentheses.
  - `L034–L037`: **Sorting & Row Limiting** — `ORDER BY` (column name, alias, position), `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`, logical query execution order (`FROM` -> `WHERE` -> `SELECT` -> `ORDER BY`), and ANSI row limiting (`OFFSET n ROWS FETCH FIRST/NEXT m ROWS ONLY` vs. `WITH TIES` and `PERCENT`).
  - `L038–L040`: **SQL\*Plus Substitution Variables** — Single `&` vs. double `&&`, quoting character substitutions (`'&job'`), `DEFINE`, `UNDEFINE`, and `SET VERIFY ON/OFF`.
    - *Variant A*: Live interactive scripts in `sqlcl`/`sqlplus`.
    - *Variant B*: Interactive `sqlplus` prompt simulator on GitHub Pages + Read the Docs annotated transcripts.
  - `L041–L042`: **Identical Checkpoint #1 (Assessment + Reflection)** — Compare `CP-1` vs. `CP-0` on GitHub Pages.

---

### Phase 3: Single-Row, Conversion & Conditional Functions (`L043`–`L068` | 26 Lessons)
> [!TIP]
> **Exam Priority**: Domain 3 (*Using Functions*) is **25% of the 1Z0-171 exam**. Real beginners need slow, visual practice with string indexing (1-based in Oracle!) and nested function evaluation.

* **Lesson Breakdown**:
  - `L043–L046`: **Case & Basic Character Functions** — `LOWER`, `UPPER`, `INITCAP`, `CONCAT`, `LENGTH`, `TRIM` (`LEADING`/`TRAILING`/`BOTH`), `REPLACE`.
  - `L047–L050`: **String Slicing & Searching** — `SUBSTR` (positive & negative start positions), `INSTR` (nth occurrence), `LPAD`/`RPAD`, and nesting `SUBSTR(email, 1, INSTR(email, '@') - 1)`.
  - `L051–L054`: **Numeric Functions** — `ROUND(n, d)` and `TRUNC(n, d)` (including negative `d` like `-1`, `-2`), `MOD`, `CEIL`, `FLOOR`.
  - `L055–L060`: **Working with Dates** — Internal date storage, `SYSDATE`, `Date + Number`, `Date - Date`, `MONTHS_BETWEEN`, `ADD_MONTHS`, `NEXT_DAY`, `LAST_DAY`, `ROUND(date, 'MONTH'/'YEAR')`, `TRUNC(date, 'MONTH'/'YEAR')`.
  - `L061–L064`: **Implicit vs. Explicit Conversion** — `TO_CHAR` (date & number format models: `YYYY`, `MM`, `MON`, `DAY`, `HH24:MI:SS`, `999,999.00`, `L`, `fm`, `fx`), `TO_DATE` (`RR` vs. `YY` century rules), `TO_NUMBER`.
  - `L065–L068`: **Null-Handling & Conditional Expressions** — `NVL`, `NVL2`, `NULLIF`, `COALESCE` (short-circuiting & data-type mismatch traps like `NVL(comm, 'None')`), simple & searched `CASE`, and `DECODE` (including how `DECODE` matches `NULL = NULL`).
* **Publishing Split**:
  - *Read the Docs*: Visual "Inside-Out Function Nesting" guide and complete `TO_CHAR` format-model reference table.
  - *GitHub Pages*: Interactive `SUBSTR`/`INSTR` index visualizer and "Predict the Function Output" timed drill.

---

### Phase 4: Grouping & Aggregating Data (`L069`–`L082` | 14 Lessons)
* **Lesson Breakdown**:
  - `L069–L073`: **Aggregate Functions & `NULL` Traps** — `COUNT(*)`, `COUNT(col)`, `COUNT(DISTINCT col)`, `SUM`, `AVG`, `MIN`, `MAX`; proving on `SCOTT.EMP.COMM` why `AVG(comm)` differs dramatically from `AVG(NVL(comm, 0))`.
  - `L074–L078`: **`GROUP BY`, `HAVING` & Nested Aggregates** — Grouping by single and multiple columns, fixing `ORA-00979`, `WHERE` (pre-group) vs. `HAVING` (post-group), and 2-level nested group functions (`SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno`).
  - `L079–L080`: **Consolidation Lab & "Human Compiler" Drill #1** — 15 paper/browser code-reading questions covering Phases 1–4 without running a database.
  - `L081–L082`: **Identical Checkpoint #2 (Assessment + Reflection)** — Compare `CP-2` vs. `CP-0`/`CP-1` on GitHub Pages.

---

### Phase 5: Displaying Data from Multiple Tables — Joins (`L083`–`L102` | 20 Lessons)
* **Lesson Breakdown**:
  - `L083–L085`: **Mental Model of Joins & `CROSS JOIN`** — Visualizing row-by-row matching; why missing a join condition creates a Cartesian product (`14 × 4 = 56` rows on `SCOTT.EMP × SCOTT.DEPT`).
  - `L086–L088`: **`INNER JOIN ... ON` & Table Aliases** — Joining `SCOTT.EMP` and `SCOTT.DEPT`, resolving ambiguous column names (`ORA-00918`), and joining 3+ tables (`HR.EMPLOYEES` -> `DEPARTMENTS` -> `LOCATIONS` -> `COUNTRIES`).
  - `L089–L092`: **`NATURAL JOIN` & `JOIN ... USING`** — Hidden multi-column matches in `NATURAL JOIN` (`HR.EMPLOYEES` + `HR.DEPARTMENTS` matching both `department_id` and `manager_id`), and the `ORA-25154` rule (never qualify a `USING` column!).
  - `L093–L096`: **Outer Joins (`LEFT`, `RIGHT`, `FULL`)** — Spotting unmatched rows using `SCOTT.DEPT` #40 (`OPERATIONS`, which has 0 employees) and `HR.EMPLOYEES` with `NULL` `department_id`; `ON` filter vs. `WHERE` filter pitfall in outer joins.
  - `L097–L100`: **Self-Joins & Non-Equijoins** — Employee-to-Manager reporting trees (`SCOTT.EMP e LEFT JOIN SCOTT.EMP m ON e.mgr = m.empno`, keeping `KING` at the top!) and salary bands (`SCOTT.EMP e JOIN SCOTT.SALGRADE s ON e.sal BETWEEN s.losal AND s.hisal`).
  - `L101–L102`: **Multi-Table Reporting Lab** — Combined Joins + Functions + `GROUP BY` exercises on `SCOTT` and `HR`.
* **Publishing Split**:
  - *GitHub Pages*: Interactive animated Join Visualizer (step-by-step row matching on `SCOTT.EMP` & `SCOTT.DEPT`).

---

### Phase 6: Subqueries & Compound Queries (`L103`–`L122` | 20 Lessons)
* **Lesson Breakdown**:
  - `L103–L107`: **Single-Row Subqueries** — Solving "who earns more than JONES?" (`SCOTT.EMP`), subqueries in `WHERE`, `HAVING`, and scalar subqueries in `SELECT`; handling `ORA-01427` (single-row subquery returns more than one row) and empty subqueries returning `NULL`.
  - `L108–L112`: **Multi-Row Subqueries (`IN`, `ANY`, `ALL`) & The `NOT IN` + `NULL` Trap** — Demonstrating on `SCOTT.EMP.MGR` why `WHERE empno NOT IN (SELECT mgr FROM scott.emp)` returns **0 rows** (`KING` has `MGR = NULL`), and fixing it with `IS NOT NULL` or `NOT EXISTS`.
  - `L113–L116`: **Inline Views, Multi-Column & Correlated Subqueries** — Subqueries in `FROM`, pairwise vs. non-pairwise multi-column comparisons, correlated subqueries, and `EXISTS` / `NOT EXISTS`.
  - `L117–L120`: **`SET` Operators** — `UNION`, `UNION ALL`, `INTERSECT`, `MINUS` (and 23ai `EXCEPT`), column-count & data-type matching rules, dummy columns (`TO_CHAR(NULL)`), and placing `ORDER BY` only at the end.
  - `L121–L122`: **Identical Checkpoint #3 (Assessment + Reflection)** — Compare `CP-3` vs. `CP-0..2`; target: crossing the 65% threshold for the first time.

---

### Phase 7: Data Manipulation (DML) & Transactions (TCL) (`L123`–`L138` | 16 Lessons)
* **Beginner Goal**: Safely change data and understand why Oracle protects concurrent users with transactions.
* **Lesson Breakdown**:
  - `L123–L126`: **`INSERT`, `UPDATE`, `DELETE` Basics** — Creating personal writable copies of `SCOTT`'s `EMP` and `DEPT` tables (`my_emp`, `my_dept`), inserting rows with explicit/implicit nulls and `DEFAULT`, updating and deleting with `WHERE` safety checks.
  - `L127–L128`: **Subquery-Driven & Correlated DML** — `INSERT INTO ... SELECT`, correlated `UPDATE`, and correlated `DELETE`.
  - `L129–L132`: **Multi-Table `INSERT` & `MERGE`** — Unconditional `INSERT ALL`, Conditional `INSERT ALL` vs. `INSERT FIRST`, and `MERGE INTO ... WHEN MATCHED THEN UPDATE ... DELETE WHERE ... WHEN NOT MATCHED THEN INSERT`.
  - `L133–L138`: **Transaction Control, Implicit Commits & Locking** — `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `ROLLBACK TO SAVEPOINT`; why any DDL/DCL causes an implicit `COMMIT`; Read Consistency and row locking (`FOR UPDATE`).
    - *Variant A*: Two-session live lock experiment (`sqlcl` + VS Code).
    - *Variant B*: `SAVEPOINT`/`MERGE` in FreeSQL + two-tab Read Consistency lab in OCI Always Free Autonomous Database.

---

### Phase 8: DDL, Constraints, Views, Sequences, Indexes & Synonyms (`L139`–`L162` | 24 Lessons)
* **Beginner Goal**: Design clean relational schemas from scratch and understand every exam-tested database object.
* **Lesson Breakdown**:
  - `L139–L144`: **Data Types, `CREATE TABLE`, `CTAS` & `ALTER TABLE`** — Naming rules, `VARCHAR2`, `CHAR`, `NUMBER(p,s)`, `DATE`, `CLOB`, `BLOB`, 23ai native `BOOLEAN`; `CREATE TABLE ... AS SELECT` (only explicit `NOT NULL` copies!); `ALTER TABLE` (`ADD`, `MODIFY`, `DROP COLUMN`, `SET UNUSED`, `DROP UNUSED COLUMNS`); `TRUNCATE TABLE` vs. `DELETE` vs. `DROP TABLE ... PURGE`.
  - `L145–L150`: **Constraints Deep Dive** — Inline vs. out-of-line syntax for `NOT NULL`, `UNIQUE` (allows multiple `NULL`s!), `PRIMARY KEY`, `FOREIGN KEY` (`ON DELETE CASCADE` vs. `ON DELETE SET NULL`), and `CHECK`; `ENABLE`/`DISABLE`, `DEFERRABLE`, and `DROP TABLE ... CASCADE CONSTRAINTS`.
  - `L151–L153`: **Global Temporary Tables & External Tables** — `ON COMMIT DELETE ROWS` vs. `ON COMMIT PRESERVE ROWS`; reading external files via `ORGANIZATION EXTERNAL` (`ORACLE_LOADER`, `ORACLE_DATAPUMP` — live in Variant A, syntax walkthrough + GitHub Pages drill in Variant B).
  - `L154–L157`: **Views** — `CREATE OR REPLACE [FORCE] VIEW`, Simple vs. Complex views (when DML is allowed/blocked), `WITH CHECK OPTION`, and `WITH READ ONLY`.
  - `L158–L160`: **Sequences, Indexes & Synonyms** — `CREATE SEQUENCE` (`NEXTVAL`, `CURRVAL` `ORA-08002` rule, `CACHE`, `CYCLE`, `GENERATED ... AS IDENTITY`), B-tree/unique/composite/function-based/invisible indexes, and private vs. `PUBLIC` synonyms.
  - `L161–L162`: **Identical Checkpoint #4 (Assessment + Reflection)** — Compare `CP-4` vs. `CP-0..3`.

---

### Phase 9: Data Dictionary, Time Zones & Controlling User Access (`L163`–`L178` | 16 Lessons)
* **Lesson Breakdown**:
  - `L163–L166`: **Oracle Data Dictionary** — Navigating `DICTIONARY` (`DICT`), `USER_*` vs. `ALL_*` vs. `DBA_*`; inspecting `USER_TABLES`, `USER_TAB_COLUMNS`, `USER_CONSTRAINTS`, `USER_CONS_COLUMNS`, `USER_VIEWS`, `USER_SEQUENCES`, `USER_IND_COLUMNS`; adding metadata with `COMMENT ON`.
  - `L167–L172`: **Time Zones & Interval Data Types** — `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`; `INTERVAL YEAR TO MONTH` and `INTERVAL DAY TO SECOND`; `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `LOCALTIMESTAMP`, `DBTIMEZONE`, `SESSIONTIMEZONE`, `EXTRACT`, `TZ_OFFSET`, `FROM_TZ`, `TO_TIMESTAMP`, `TO_YMINTERVAL`, `TO_DSINTERVAL`.
  - `L173–L178`: **Controlling User Access (DCL)** — System privileges vs. Object privileges, `CREATE USER`, `ALTER USER`, `CREATE ROLE`, `GRANT`, `REVOKE`, and the critical cascading distinction:
    - Object privilege + `WITH GRANT OPTION` -> `REVOKE` **cascades**.
    - System privilege + `WITH ADMIN OPTION` -> `REVOKE` **does NOT cascade**.
    - *Variant A*: Live 3-user cascade test on in-house PDB.
    - *Variant B*: Live 3-user cascade test on OCI Always Free Autonomous Database + GitHub Pages privilege-cascade visualizer.

---

### Phase 10: Exam Mastery, Mock Exams & Final Readiness (`L179`–`L200` | 22 Lessons)
* **Beginner Goal**: Transition from comfortable SQL user to calm, fast, exam-ready test taker.
* **Lesson Breakdown**:
  - `L179–L184`: **"Human Compiler" Intensive (No-IDE Code Reading)** — 6 focused clinics (1 per high-risk cluster: `NULL` traps, Function nesting/conversion, Join & `USING` traps, Subquery/`SET` rules, DDL/Constraint/View rules, DCL/Timezones) using GitHub Pages timed drills.
  - `L185–L189`: **Full-Length Timed Mock Exam #1 & Deep Debrief** —
    - `L185–L187`: 60 questions in 120 minutes on the **GitHub Pages Mock Exam Simulator** (practicing the 3-pass pacing method: Pass 1 direct questions, Pass 2 complex tracing, Pass 3 multi-select verification).
    - `L188–L189`: Line-by-line review of missed questions mapped back to Read the Docs chapters.
  - `L190–L193`: **Targeted Remediation Labs** — Personalized hands-on labs in Oracle DB (Variant A or B) targeting each learner's lowest-scoring domains from Mock Exam #1.
  - `L194–L198`: **Full-Length Timed Mock Exam #2 & Exam-Day Readiness** —
    - `L194–L196`: Second unseen 60-question / 120-minute timed exam (target: **≥ 75% / 45 correct**).
    - `L197–L198`: Debrief + Oracle MyLearn booking, online proctoring room check, and stress-management checklist.
  - `L199–L200`: **Identical Checkpoint #5 (Final Readiness + 200-Lesson Retrospective)** —
    - `L199`: Final run of the identical benchmark (`CP-5`), now unlocking the complete answer key and worked solutions.
    - `L200`: View the complete `CP-0 -> CP-5` longitudinal growth chart on GitHub Pages, celebrate the transformation from zero knowledge to certification readiness, and finalize individual exam dates.
