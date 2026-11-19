# Variant B: Free Online Cloud Environment (Zero Installation)

Use this setup if you have no local admin rights, are on a Chromebook/locked-down laptop, or want to start writing Oracle 23ai SQL within 60 seconds with **zero software installation**.

---

## 1. Daily Sandbox: Oracle FreeSQL (`Live SQL v2`)

- **URL**: [https://freesql.com/](https://freesql.com/) (also reachable via [https://livesql.oracle.com/](https://livesql.oracle.com/))
- **Cost**: 100% Free, no time limit, no credit card required.
- **Engine**: Powered by a real **Oracle Database 23ai** instance.

### Step-by-Step Quickstart
1. Open [freesql.com](https://freesql.com/) in your browser.
2. Sign in with a free Oracle account (SSO) so your scripts and personal schema tables persist.
3. Open a new **SQL Worksheet**.
4. Test the pre-loaded `SCOTT` and `HR` schemas immediately:
   ```sql
   SELECT empno, ename, job, sal, comm FROM scott.emp ORDER BY sal DESC;
   SELECT first_name, last_name, salary FROM hr.employees FETCH FIRST 5 ROWS ONLY;
   ```
5. For **Phase 7 (DML)** and **Phase 8 (DDL)**, you will create writable tables inside your own personal schema by pasting [`scott_tiger.sql`](../schemas/scott_tiger.sql) into the worksheet.
6. Or jump straight into any module using our pre-packaged [**FreeSQL Lab Pack & Live Sandboxes**](../labs/freesql-upload-pack.md) (one-click `freesql.com/embedded/` links and downloadable `.sql` scripts for **My Content → Upload Script**).

!!! note "Optional External Connection"
    FreeSQL also provides **SQL*Net connection details** for your personal schema if you later choose to connect from VS Code or SQLcl.

---

## 2. Multi-User & Locking Lab: OCI Always Free Autonomous Database

FreeSQL gives each learner a single personal schema. To run **two-session locking** (Phase 7) and **multi-user `GRANT`/`REVOKE` cascades** (Phase 9) hands-on:

- **URL**: [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
- **What you get**: 2 **Always Free Oracle Autonomous Databases (23ai)** that never expire, complete with browser-based **Database Actions (SQL Developer Web)**.
- **How we use it**: Create two extra users (`APP_USER_B`, `APP_USER_C`) inside Database Actions and open two browser tabs to observe `WITH GRANT OPTION` vs. `WITH ADMIN OPTION` revocation behavior live.

---

## 3. Quick Shareable Scratchpad: db<>fiddle

- **URL**: [https://dbfiddle.uk/?rdbms=oracle_23](https://dbfiddle.uk/?rdbms=oracle_23)
- **Best for**: Zero-login troubleshooting. Paste a tiny `CREATE TABLE` + `SELECT`, run it on Oracle 23ai, and share the URL with your instructor or study group.

---

## Bridging Browser Differences (Important for 1Z0-171!)

Browser worksheets behave slightly differently from command-line `sqlplus` on two exam topics:

| Exam Topic | In Browser (FreeSQL) | On the 1Z0-171 Exam (`sqlplus`) | How Variant B Covers It |
| :--- | :--- | :--- | :--- |
| **Substitution Variables** (`&`, `&&`, `DEFINE`, `VERIFY`) | May show a web modal or differ in `old:`/`new:` output | Prompts interactively in CLI; `&&` defines session variable; `SET VERIFY ON` prints `old`/`new` lines | Use the **SQL\*Plus Simulator** on our [GitHub Pages Interactive Studio](https://chatelao.github.io/sql-schulung/) (`L038–L040`) |
| **External Tables** (`ORGANIZATION EXTERNAL`) | Cannot read host OS directories in multi-tenant cloud sandbox | Tested via DDL syntax & `DEFAULT DIRECTORY` / `ACCESS PARAMETERS` | Covered via annotated DDL walkthrough & "Human Compiler" questions (`L151–L153`) |
