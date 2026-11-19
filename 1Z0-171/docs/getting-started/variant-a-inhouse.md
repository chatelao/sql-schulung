# Variante A: In-House Oracle Database Setup

Nutze dieses Setup, wenn du im Schulungsraum mit einem internen Oracle-Database-Server arbeitest oder **Oracle Database 23ai Free** lokal über Docker/Podman startest. Variante A deckt **100 % der 1Z0-171-Exam-Objectives** nativ ab, inklusive CLI Substitution Variables, Multi-User `GRANT`/`REVOKE`-Kaskaden, Two-Session Locking und External Tables.

---

## Option A1: Lokaler Container (`Oracle Database 23ai Free`)

### 1. Datenbank-Container starten
```bash
docker run -d \
  --name oracle23ai \
  -p 1521:1521 \
  -e ORACLE_PWD=Welcome123! \
  container-registry.oracle.com/database/free:latest
```

Warte ca. 60 Sekunden, bis die Datenbank `DATABASE IS READY TO USE!` meldet:
```bash
docker logs -f oracle23ai
```

### 2. Client-Tools installieren
- **IDE**: Installiere **Visual Studio Code** + die offizielle **Oracle SQL Developer Extension for VSCode** (oder klassischen Oracle SQL Developer).
- **CLI**: Installiere **Oracle SQLcl** (`sql`) oder **SQL*Plus** (`sqlplus`), das auch direkt im Container verfügbar ist:
  ```bash
  docker exec -it oracle23ai sqlplus sys/Welcome123!@FREEPDB1 as sysdba
  ```

---

## Option A2: Schulungsserver / In-House Pluggable Database (PDB)

Für Trainerinnen und Trainer, die eine gemeinsame Trainings-PDB (`PDB_TRAINING`) bereitstellen:

```sql
-- Als SYSDBA innerhalb von PDB_TRAINING ausführen
CREATE USER student_01 IDENTIFIED BY Welcome123!
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users;

GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW,
      CREATE SEQUENCE, CREATE SYNONYM TO student_01;

-- Zweiter Peer-Account für Phase 9 (DCL GRANT/REVOKE Kaskaden-Labs)
CREATE USER student_01_peer IDENTIFIED BY Welcome123!
  DEFAULT TABLESPACE users
  QUOTA 10M ON users;

GRANT CREATE SESSION TO student_01_peer;
```

---

## Beispiel-Schemas installieren (`SCOTT/TIGER` + `HR`)

### 1. Klassisches `SCOTT/TIGER` Schema
Lade [`scott_tiger.sql`](../schemas/scott_tiger.sql) herunter und führe es in deinem Student-Schema aus (oder lege für nostalgische Authentizität einen User `SCOTT` mit Passwort `tiger` an):

```bash
sqlplus scott/tiger@localhost:1521/FREEPDB1 @scott_tiger.sql
```

### 2. Offizielles Oracle 23ai `HR` Sample Schema
Klone oder lade das offizielle Repository [Oracle Database Sample Schemas](https://github.com/oracle-samples/db-sample-schemas) herunter und führe `hr_install.sql` in `FREEPDB1` aus.

!!! tip "Setup überprüfen"
    Führe diesen kurzen Smoke-Test sowohl in VS Code als auch in `sqlcl`/`sqlplus` aus:
    ```sql
    SELECT d.dname, COUNT(e.empno) AS headcount
    FROM scott.dept d
    LEFT JOIN scott.emp e ON d.deptno = e.deptno
    GROUP BY d.dname
    ORDER BY d.dname;
    ```
    Du solltest 4 Zeilen sehen, darunter `OPERATIONS` mit `0` als `headcount`.
