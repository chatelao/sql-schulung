# Wiederkehrende identische Checkpoints (`CP-0` bis `CP-5`)

Statt sechs völlig unterschiedliche Tests zu schreiben – bei denen unklar bleibt, ob ein besserer Score durch leichtere Fragen oder echtes Lernen entstanden ist –, durchläufst du **sechsmal exakt denselben standardisierten Benchmark („The 1Z0-171 Benchmark“)**:

| Checkpoint | Lektionen | Zeitpunkt | Answer Key Status | Erwarteter Gesamtscore |
| :---: | :---: | :--- | :---: | :---: |
| **CP-0** | `L001–L002` | Kursbeginn (ohne Vorkenntnisse) | Gesperrt | 10–25 % |
| **CP-1** | `L041–L042` | Nach Phase 2 (Foundations, `SELECT`, Filtering, Variables) | Gesperrt | 30–40 % |
| **CP-2** | `L081–L082` | Nach Phase 4 (Functions & Grouping) | Gesperrt | 50–60 % |
| **CP-3** | `L121–L122` | Nach Phase 6 (Joins, Subqueries & `SET` Operators) | Gesperrt | 65–72 % |
| **CP-4** | `L161–L162` | Nach Phase 8 (DML, TCL, DDL, Constraints, Views, Indexes) | Gesperrt | 75–85 % |
| **CP-5** | `L199–L200` | Ende von Phase 10 (Final Readiness) | **Freigeschaltet** | **≥ 85 %** |

---

## Ablauf jedes 90-Minuten-Checkpoints

1. **Erste 45 Minuten — Benchmark absolvieren (auf GitHub Pages)**:
   - **Part A (22 feste Fragen)**: 2 identische Fragen im Prüfungsstil pro Exam Domain (11 Domains).
   - **Part B (3 Gold Standard SQL Tasks)**:
     1. *Query Task (`SCOTT`)*: Multi-Table Join (`EMP`, `DEPT`, `SALGRADE`) mit `NULL`-sicherem Pay (`NVL(comm, 0)`) und `GROUP BY`/`HAVING`.
     2. *Subquery / Set Task (`HR`)*: Departments ohne Employees oder Employees über ihrem Department-Durchschnitt finden.
     3. *Schema Task*: Ein `CREATE TABLE`-DDL-Statement mit `PRIMARY KEY`, `FOREIGN KEY (ON DELETE SET NULL)` und `CHECK` schreiben.
   - **Part C (Confidence Calibration)**: Bewerte deine Sicherheit (1–5) pro Domain *bevor* dein Score angezeigt wird.
2. **Zweite 45 Minuten — Delta-Review & Reflexion**:
   - Prüfe dein Domain-Wachstumsdiagramm im GitHub Pages Checkpoint Studio.
   - Identifiziere **Blind Spots** (Domains mit Confidence `≥ 4/5`, aber Score `< 50 %`).
   - Speichere dein 4-Fragen-Reflexionslog und exportiere einen Markdown-/JSON-Snapshot.

!!! warning "Warum der Answer Key bis `CP-5` gesperrt bleibt"
    Bei `CP-0` bis `CP-4` siehst du deine **Prozentwerte je Domain** (z. B. *Domain 3: 75 %*), nicht jedoch die einzelnen Musterlösungen. So spiegeln deine Punktesprünge echtes SQL-Verständnis wider und kein Auswendiglernen von 22 Antworten. Bei `CP-5` (`L199–L200`) werden alle Lösungen und Erklärungen automatisch freigeschaltet.
