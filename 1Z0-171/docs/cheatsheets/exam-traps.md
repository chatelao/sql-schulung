# Top 15 `1Z0-171` Exam Traps

1. **`NOT IN` + `NULL` liefert 0 Rows**: `WHERE empno NOT IN (SELECT mgr FROM scott.emp)` liefert eine **leere Ergebnismenge**, weil `KING` den Wert `mgr = NULL` hat.
2. **`= NULL` ist immer `UNKNOWN`**: Verwende niemals `= NULL` oder `<> NULL` in `WHERE` oder `CASE WHEN`. Nur `IS NULL` / `IS NOT NULL` funktioniert (Ausnahme `DECODE`, das `NULL = NULL` als gleich behandelt).
3. **Qualifizieren einer `USING`-Spalte schlägt fehl (`ORA-25154`)**: Eine in `JOIN ... USING (deptno)` genannte Spalte darf nirgendwo in der Query mit `e.` oder `d.` qualifiziert werden.
4. **`NATURAL JOIN` verknüpft ALLE gleichnamigen Spalten**: `HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS` joint automatisch über **beide** Spalten: `department_id` UND `manager_id`.
5. **Aliases in `WHERE` scheitern (`ORA-00904`)**: Column Aliases sind erst in `ORDER BY` sichtbar, niemals in `WHERE`, `GROUP BY` oder `HAVING`.
6. **`NVL`-Datentyp-Konflikt (`ORA-01722`)**: `NVL(comm, 'N/A')` schlägt fehl, weil Argument 2 in den Datentyp von Argument 1 (`NUMBER`) konvertiert wird.
7. **`CTAS` kopiert nur explizite `NOT NULL`-Constraints**: `CREATE TABLE copy AS SELECT * FROM emp` übernimmt **keine** `PRIMARY KEY`-, `FOREIGN KEY`-, `UNIQUE`-, `CHECK`-Constraints oder `DEFAULT`-Werte.
8. **Jedes DDL oder DCL führt ein Auto-Commit aus**: Selbst ein fehlgeschlagenes `CREATE TABLE`, das das Parsing passiert, löst ein implizites `COMMIT` deiner offenen Transaktion aus!
9. **`UNIQUE` erlaubt mehrere `NULL`s**: Anders als ein `PRIMARY KEY` lässt ein `UNIQUE` Constraint beliebig viele `NULL`-Zeilen zu.
10. **`CURRVAL` erfordert zuerst `NEXTVAL`**: Der Aufruf von `my_seq.CURRVAL` in einer frischen Session ohne vorheriges `my_seq.NEXTVAL` wirft `ORA-08002`.
11. **`SET` Operators übernehmen Spaltennamen vom 1. `SELECT`**: `ORDER BY` darf nur ganz am Ende stehen und muss Spaltennamen/-Aliases des ersten `SELECT` (oder Positionsnummern) verwenden.
12. **`REVOKE` Object vs. System Privileges**: Der Entzug eines Object Privilege (`WITH GRANT OPTION`) **kaskadiert**; der Entzug eines System Privilege (`WITH ADMIN OPTION`) **kaskadiert NICHT**.
13. **Verschachtelte Group Functions brauchen `GROUP BY`**: `SELECT MAX(AVG(sal)) FROM emp GROUP BY deptno` ist gültig; ohne `GROUP BY` oder mit zusätzlichem `deptno` in `SELECT` schlägt es fehl.
14. **`MERGE ... DELETE WHERE`-Geltungsbereich**: Löscht ausschließlich Zeilen, die von diesem `MERGE` **gematcht und aktualisiert** wurden (ausgewertet auf den Werten *nach* dem `UPDATE`).
15. **Outer-Join-Filter in `WHERE` vs. `ON`**: Ein Filter auf die rechte Tabelle innerhalb von `WHERE` (z. B. `WHERE d.loc = 'DALLAS'`) verwandelt einen `LEFT OUTER JOIN` stillschweigend zurück in einen `INNER JOIN`!
