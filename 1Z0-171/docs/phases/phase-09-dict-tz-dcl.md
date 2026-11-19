# Phase 9: Data Dictionary, Time Zones & Controlling User Access (`L163`–`L178`)

**Exam Domains**: Domain 10 (*Data Dictionary & Time Zones*, 5 %) + Domain 11 (*Controlling User Access*, 5 %)

---

## Oracle Data Dictionary (`L163`–`L166`)

### `L163` — `USER_*`, `ALL_*`, `DBA_*` und `DICTIONARY` (`DICT`)
| Präfix | Bereich (Scope) | Wer darf abfragen? |
| :--- | :--- | :--- |
| `USER_*` | Objekte im **Besitz** des aktuellen Users (ohne `OWNER`-Spalte) | Jeder User |
| `ALL_*` | Eigene Objekte **plus** für den aktuellen User freigegebene Objekte | Jeder User |
| `DBA_*` | **Alle** Objekte in der gesamten Datenbank | DBA / `SELECT_CATALOG_ROLE` |

### `L164` — Tables, Columns & Objects inspizieren
```sql
SELECT object_name, object_type, status FROM user_objects;
SELECT table_name, column_name, data_type, nullable
FROM user_tab_columns WHERE table_name = 'MY_EMP';
```

### `L165` — Constraints, Views, Sequences & Indexes inspizieren
```sql
SELECT constraint_name, constraint_type, search_condition, delete_rule
FROM user_constraints WHERE table_name = 'TASKS';
```
- Constraint-Typen: `P` (Primary Key), `R` (Referential / FK), `U` (Unique), `C` (Check oder `NOT NULL`).

### `L166` — Metadaten-Kommentare hinzufügen (`COMMENT ON`)
```sql
COMMENT ON TABLE my_emp IS 'Writable copy of classic SCOTT.EMP for training';
SELECT comments FROM user_tab_comments WHERE table_name = 'MY_EMP';
```

---

## Time Zones & Interval Data Types (`L167`–`L172`)

### `L167` — `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`
- `TIMESTAMP(p)`: Genauigkeit der Sekundenbruchteile (`0`–`9`, Standard `6`).
- `TIMESTAMP WITH TIME ZONE`: speichert exakt die Zeitzonenregion oder den Offset (`+02:00`, `Europe/Berlin`).
- `TIMESTAMP WITH LOCAL TIME ZONE`: normalisiert beim Speichern auf `DBTIMEZONE` und rechnet bei der Abfrage dynamisch in `SESSIONTIMEZONE` um!

### `L168` — `CURRENT_DATE`, `CURRENT_TIMESTAMP` & `LOCALTIMESTAMP`
| Function | Rückgabetyp | Verwendete Time Zone |
| :--- | :--- | :--- |
| `SYSDATE` | `DATE` | Host-OS-Uhr des Datenbankservers |
| `CURRENT_DATE` | `DATE` | `SESSIONTIMEZONE` |
| `SYSTIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | Host-OS-Uhr des Datenbankservers |
| `CURRENT_TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | `SESSIONTIMEZONE` |
| `LOCALTIMESTAMP` | `TIMESTAMP` (ohne TZ!) | `SESSIONTIMEZONE` |

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
- Berechne Abflug- und Ankunftszeiten über mehrere Zeitzonen hinweg mit `FROM_TZ`, `AT TIME ZONE` und `INTERVAL DAY TO SECOND`.

---

## Controlling User Access — DCL (`L173`–`L178`)

### `L173` — System Privileges vs. Object Privileges
- **System Privileges**: Was du in der Datenbank tun darfst (`CREATE SESSION`, `CREATE TABLE`, `CREATE VIEW`, `CREATE ANY TABLE`).
- **Object Privileges**: Aktionen auf einem konkreten Objekt (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `INDEX`, `REFERENCES`).

### `L174` — Users anlegen, Passwörter ändern & Roles
```sql
CREATE USER alice IDENTIFIED BY Secret123!;
CREATE ROLE hr_reader;
GRANT CREATE SESSION TO hr_reader;
GRANT hr_reader TO alice;
ALTER USER alice IDENTIFIED BY NewSecret456!;
```

### `L175` — `WITH GRANT OPTION` vs. `WITH ADMIN OPTION`
- `GRANT SELECT ON my_emp TO alice WITH GRANT OPTION;` (Object Privilege).
- `GRANT CREATE TABLE TO alice WITH ADMIN OPTION;` (System Privilege / Role).

### `L176` — Die kritische `REVOKE`-Kaskadenregel (Prüfungsliebling!)
- **Object Privilege (`WITH GRANT OPTION`)**: Bei `SYS -> Alice -> Bob` **KASKADIERT** der Entzug von `SELECT` bei Alice und entzieht das Recht automatisch auch Bob!
- **System Privilege (`WITH ADMIN OPTION`)**: Bei `SYS -> Alice -> Bob` **KASKADIERT** der Entzug von `CREATE TABLE` bei Alice **NICHT** – Bob behält `CREATE TABLE`!

### `L177`–`L178` — Multi-User Privilege Cascade Lab
- **Variante A**: Führe `L174–L176` live zwischen `STUDENT_01` und `STUDENT_01_PEER` auf deiner PDB aus.
- **Variante B**: Führe die Schritte live in zwei Browser-Sessions von **OCI Always Free Autonomous Database** aus (und prüfe das Privilege-Cascade-Verhalten in den Zusammenfassungen auf GitHub Pages).
