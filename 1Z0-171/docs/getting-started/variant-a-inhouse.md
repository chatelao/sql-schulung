# Variant A: In-House Oracle Database Setup

Use this setup if you are teaching in a classroom with an internal Oracle Database server, or running **Oracle Database 23ai Free** locally via Docker/Podman. Variant A covers **100% of 1Z0-171 exam objectives** natively, including CLI substitution variables, multi-user `GRANT`/`REVOKE` cascades, two-session locking, and external tables.

---

## Option A1: Local Container (`Oracle Database 23ai Free`)

### 1. Start the Database Container
```bash
docker run -d \
  --name oracle23ai \
  -p 1521:1521 \
  -e ORACLE_PWD=Welcome123! \
  container-registry.oracle.com/database/free:latest
```

Wait ~60 seconds until the database reports `DATABASE IS READY TO USE!`:
```bash
docker logs -f oracle23ai
```

### 2. Install Client Tools
- **IDE**: Install **Visual Studio Code** + the official **Oracle SQL Developer Extension for VSCode** (or classic Oracle SQL Developer).
- **CLI**: Install **Oracle SQLcl** (`sql`) or **SQL*Plus** (`sqlplus`), which is also available directly inside the container:
  ```bash
  docker exec -it oracle23ai sqlplus sys/Welcome123!@FREEPDB1 as sysdba
  ```

---

## Option A2: Classroom / In-House Pluggable Database (PDB)

For instructors provisioning a shared training PDB (`PDB_TRAINING`):

```sql
-- Run as SYSDBA inside PDB_TRAINING
CREATE USER student_01 IDENTIFIED BY Welcome123!
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users;

GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW,
      CREATE SEQUENCE, CREATE SYNONYM TO student_01;

-- Secondary peer account for Phase 9 (DCL GRANT/REVOKE cascade labs)
CREATE USER student_01_peer IDENTIFIED BY Welcome123!
  DEFAULT TABLESPACE users
  QUOTA 10M ON users;

GRANT CREATE SESSION TO student_01_peer;
```

---

## Installing Sample Schemas (`SCOTT/TIGER` + `HR`)

### 1. Classic `SCOTT/TIGER` Schema
Download and execute [`scott_tiger.sql`](../schemas/scott_tiger.sql) inside your student schema (or create a shared `SCOTT` user with password `tiger` for nostalgic authenticity):

```bash
sqlplus scott/tiger@localhost:1521/FREEPDB1 @scott_tiger.sql
```

### 2. Official Oracle 23ai `HR` Sample Schema
Clone or download the official [Oracle Database Sample Schemas](https://github.com/oracle-samples/db-sample-schemas) repository and run `hr_install.sql` inside `FREEPDB1`.

!!! tip "Verify Your Setup"
    Run this quick smoke test in both VS Code and `sqlcl`/`sqlplus`:
    ```sql
    SELECT d.dname, COUNT(e.empno) AS headcount
    FROM scott.dept d
    LEFT JOIN scott.emp e ON d.deptno = e.deptno
    GROUP BY d.dname
    ORDER BY d.dname;
    ```
    You should see 4 rows, including `OPERATIONS` with `0` headcount.
