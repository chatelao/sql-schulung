# Variante B: Kostenlose Online-Cloud-Umgebung (Zero Installation)

Nutze dieses Setup, wenn du keine lokalen Admin-Rechte hast, auf einem Chromebook oder gesperrten Laptop arbeitest oder innerhalb von 60 Sekunden ohne Software-Installation echtes Oracle-26ai/23ai-SQL schreiben möchtest.

---

## 1. Tägliche Sandbox: Oracle FreeSQL (`Live SQL v2`)

- **URL**: [https://freesql.com/](https://freesql.com/) (auch erreichbar über [https://livesql.oracle.com/](https://livesql.oracle.com/))
- **Kosten**: 100 % kostenlos, kein Zeitlimit, keine Kreditkarte erforderlich.
- **Engine**: Läuft auf einer echten **Oracle Database 26ai/23ai**-Instanz.

### Schritt-für-Schritt-Quickstart
1. Öffne [freesql.com](https://freesql.com/) im Browser.
2. Melde dich mit einem kostenlosen Oracle-Account (SSO) an, damit deine Skripte und eigenen Schema-Tabellen gespeichert bleiben.
3. Öffne ein neues **SQL Worksheet**.
4. Teste sofort die vorinstallierten `SCOTT`- und `HR`-Schemas:
   ```sql
   SELECT empno, ename, job, sal, comm FROM scott.emp ORDER BY sal DESC;
   SELECT first_name, last_name, salary FROM hr.employees FETCH FIRST 5 ROWS ONLY;
   ```
5. Für **Phase 7 (DML)** und **Phase 8 (DDL)** legst du schreibbare Tabellen in deinem persönlichen Schema an, indem du [`scott_tiger.sql`](../schemas/scott_tiger.sql) im Worksheet ausführst.
6. Oder starte direkt aus jedem Modul über unser vorbereitetes [**FreeSQL Lab Pack & Live-Sandboxes**](../labs/freesql-upload-pack.md) (Ein-Klick-Links für `freesql.com/embedded/` sowie `.sql`-Dateien zum Download für **My Content → Upload Script**).

!!! note "Optionale externe Verbindung"
    FreeSQL stellt für dein persönliches Schema auch **SQL*Net-Verbindungsdaten** bereit, falls du später aus VS Code oder SQLcl zugreifen möchtest.

---

## 2. Multi-User & Locking Lab: OCI Always Free Autonomous Database

FreeSQL bietet jedem Lernenden genau ein persönliches Schema. Um **Two-Session Locking** (Phase 7) und **Multi-User `GRANT`/`REVOKE`-Kaskaden** (Phase 9) praktisch durchzuführen:

- **URL**: [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
- **Was du bekommst**: 2 **Always Free Oracle Autonomous Databases (26ai/23ai)** ohne Ablaufdatum inklusive browserbasiertem **Database Actions (SQL Developer Web)**.
- **Einsatz im Kurs**: Lege in Database Actions zwei zusätzliche User (`APP_USER_B`, `APP_USER_C`) an und öffne zwei Browser-Tabs, um `WITH GRANT OPTION` vs. `WITH ADMIN OPTION` beim `REVOKE` live zu beobachten.

---

## 3. Schneller teilbarer Scratchpad: db<>fiddle

- **URL**: [https://dbfiddle.uk/?rdbms=oracle_23](https://dbfiddle.uk/?rdbms=oracle_23)
- **Ideal für**: Fehlersuche ohne Login. Kleines `CREATE TABLE` + `SELECT` einfügen, auf Oracle 26ai/23ai ausführen und die URL mit Trainer oder Lerngruppe teilen.

---

## Browser-Unterschiede überbrücken (Wichtig für `1Z0-171`!)

Browser-Worksheets verhalten sich bei zwei Prüfungsthemen leicht anders als die Kommandozeile `sqlplus`:

| Prüfungsthema | Im Browser (FreeSQL) | Im `1Z0-171`-Examen (`sqlplus`) | So deckt Variante B es ab |
| :--- | :--- | :--- | :--- |
| **Substitution Variables** (`&`, `&&`, `DEFINE`, `VERIFY`) | Zeigt Web-Dialog oder weicht bei `old:`/`new:` ab | Fragt interaktiv im CLI; `&&` definiert Session Variable; `SET VERIFY ON` druckt `old`/`new` | Nutze den **SQL\*Plus Simulator** in unserem [GitHub Pages Interactive Studio](https://chatelao.github.io/sql-schulung/#labs/sqlplus) (`L038–L040`) |
| **External Tables** (`ORGANIZATION EXTERNAL`) | Kein Zugriff auf Host-OS-Verzeichnisse in der Multi-Tenant-Cloud | Abgeprüft über DDL-Syntax & `DEFAULT DIRECTORY` / `ACCESS PARAMETERS` | Abgedeckt durch kommentierte DDL-Beispiele & „Human Compiler“-Fragen (`L151–L153`) |
