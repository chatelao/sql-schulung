# Phase 9: Data Dictionary, Time Zones & Controlling User Access (`L163`–`L178`)

**Exam Domains**: Domain 10 (*Data Dictionary & Time Zones*, 5%) + Domain 11 (*Controlling User Access*, 5%)

---

## Oracle Data Dictionary (`L163`–`L166`)

### `L163` — `USER_*`, `ALL_*`, `DBA_*` and `DICTIONARY` (`DICT`)
| Prefix | Scope | Who Can Query |
| :--- | :--- | :--- |
| `USER_*` | Objects **owned** by current user (no `OWNER` column) | Any user |
| `ALL_*` | Objects owned **plus** objects granted to current user | Any user |
| `DBA_*` | **All** objects in the database | DBA / `SELECT_CATALOG_ROLE` |

### `L164` — Inspecting Tables, Columns & Objects
```sql
SELECT object_name, object_type, status FROM user_objects;
SELECT table_name, column_name, data_type, nullable
FROM user_tab_columns WHERE table_name = 'MY_EMP';
```

### `L165` — Inspecting Constraints, Views, Sequences & Indexes
```sql
SELECT constraint_name, constraint_type, search_condition, delete_rule
FROM user_constraints WHERE table_name = 'TASKS';
```
- Constraint types: `P` (Primary Key), `R` (Referential / FK), `U` (Unique), `C` (Check or `NOT NULL`).

### `L166` — Adding Metadata Comments (`COMMENT ON`)
```sql
COMMENT ON TABLE my_emp IS 'Writable copy of classic SCOTT.EMP for training';
SELECT comments FROM user_tab_comments WHERE table_name = 'MY_EMP';
```

---

## Time Zones & Interval Data Types (`L167`–`L172`)

### `L167` — `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`
- `TIMESTAMP(p)`: fractional seconds precision (`0`–`9`, default `6`).
- `TIMESTAMP WITH TIME ZONE`: stores the exact time zone region or offset (`+02:00`, `Europe/Berlin`).
- `TIMESTAMP WITH LOCAL TIME ZONE`: normalizes to `DBTIMEZONE` on disk and converts dynamically to `SESSIONTIMEZONE` when queried!

### `L168` — `CURRENT_DATE`, `CURRENT_TIMESTAMP` & `LOCALTIMESTAMP`
| Function | Returns Type | Time Zone Used |
| :--- | :--- | :--- |
| `SYSDATE` | `DATE` | Database host OS clock |
| `CURRENT_DATE` | `DATE` | `SESSIONTIMEZONE` |
| `SYSTIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | Database host OS clock |
| `CURRENT_TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | `SESSIONTIMEZONE` |
| `LOCALTIMESTAMP` | `TIMESTAMP` (no TZ!) | `SESSIONTIMEZONE` |

### `L169` — `DBTIMEZONE`, `SESSIONTIMEZONE`, `TZ_OFFSET` & `FROM_TZ`
```sql
ALTER SESSION SET TIME_ZONE = '+02:00';
SELECT SESSIONTIMEZONE, TZ_OFFSET('America/New_York'),
       FROM_TZ(TIMESTAMP '2026-11-19 09:00:00', 'UTC')
FROM dual;
```

### `L170` — `INTERVAL YEAR TO MONTH` & `INTERVAL DAY TO SECOND`
```sql
SELECT DATE '2026-01-15' + INTERVAL '1-6' YEAR TO MONTH,
       SYSTIMESTAMP + INTERVAL '3 04:30:00' DAY TO SECOND
FROM dual;
```

### `L171` — `EXTRACT`, `TO_TIMESTAMP`, `TO_YMINTERVAL` & `TO_DSINTERVAL`
```sql
SELECT EXTRACT(YEAR FROM hiredate), EXTRACT(MONTH FROM hiredate) FROM scott.emp;
```

### `L172` — Global Flight Schedule Time-Zone Lab

---

## Controlling User Access — DCL (`L173`–`L178`)

### `L173` — System Privileges vs. Object Privileges
- **System Privileges**: What you can do in the database (`CREATE SESSION`, `CREATE TABLE`, `CREATE VIEW`, `CREATE ANY TABLE`).
- **Object Privileges**: Actions on a specific object (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `INDEX`, `REFERENCES`).

### `L174` — Creating Users, Altering Passwords & Roles
```sql
CREATE USER alice IDENTIFIED BY Secret123!;
CREATE ROLE hr_reader;
GRANT CREATE SESSION TO hr_reader;
GRANT hr_reader TO alice;
ALTER USER alice IDENTIFIED BY NewSecret456!;
```

### `L175` — `WITH GRANT OPTION` vs. `WITH ADMIN OPTION`
- `GRANT SELECT ON my_emp TO alice WITH GRANT OPTION;` (Object privilege).
- `GRANT CREATE TABLE TO alice WITH ADMIN OPTION;` (System privilege / Role).

### `L176` — The Critical `REVOKE` Cascading Rule (Exam Favorite!)
- **Object Privilege (`WITH GRANT OPTION`)**: If `SYS -> Alice -> Bob`, revoking `SELECT` from Alice **CASCADES** and automatically revokes it from Bob!
- **System Privilege (`WITH ADMIN OPTION`)**: If `SYS -> Alice -> Bob`, revoking `CREATE TABLE` from Alice **DOES NOT CASCADE** — Bob keeps `CREATE TABLE`!

### `L177`–`L178` — Multi-User Privilege Cascade Lab
- **Variant A**: Execute `L174–L176` live across `STUDENT_01` and `STUDENT_01_PEER` on your PDB.
- **Variant B**: Execute live across two browser sessions in **OCI Always Free Autonomous Database** (and review the privilege cascade diagram in the GitHub Pages Interactive Studio).
