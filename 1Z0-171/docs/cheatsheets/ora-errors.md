# ORA-Fehlerbehebung für Einsteiger

Wer `ORA-`-Meldungen lesen lernt, verwandelt roten Fehlertext in präzise Hinweise.

| Error Code | Oracle-Meldung (EN) | Typische Einsteiger-Ursache | Lösung |
| :--- | :--- | :--- | :--- |
| `ORA-00904` | `invalid identifier` | Tippfehler im Column Name oder ein `SELECT`-Alias wurde in `WHERE` verwendet | `DESCRIBE table` prüfen oder Ausdruck direkt statt Alias schreiben |
| `ORA-00918` | `column ambiguously defined` | Gleicher Column Name existiert in 2 gejointen Tabellen ohne Table Alias | Mit `e.deptno` oder `d.deptno` qualifizieren (außer bei `USING`) |
| `ORA-00933` | `SQL command not properly ended` | Fehlendes `AND`, überzähliges Komma oder `ORDER BY` im ersten Zweig von `UNION` | Kommas prüfen und `ORDER BY` ans Ende verschieben |
| `ORA-00942` | `table or view does not exist` | Tippfehler im Tabellennamen, fehlender Schema-Prefix (`scott.emp`) oder fehlendes `SELECT`-Recht | Schema-Prefix (`scott.emp`) & Privileges prüfen |
| `ORA-00979` | `not a GROUP BY expression` | Nicht-aggregierte Spalte in `SELECT` fehlt in `GROUP BY` | Spalte in `GROUP BY` aufnehmen oder mit `MAX`/`COUNT` aggregieren |
| `ORA-01400` | `cannot insert NULL into (...)` | Fehlender Wert für eine `NOT NULL`- oder `PRIMARY KEY`-Spalte | Nicht-`NULL`-Wert im `INSERT` angeben |
| `ORA-01427` | `single-row subquery returns more than one row` | `=`, `<` oder `>` mit einer Subquery verwendet, die 2+ Zeilen liefert | Auf `IN`, `ANY`, `ALL` wechseln oder in der Subquery aggregieren |
| `ORA-01722` | `invalid number` | `NVL(comm, 'None')` oder Vergleich einer Zahlenspalte mit nicht-numerischem String | Zahl zuerst in Text wandeln: `NVL(TO_CHAR(comm), 'None')` |
| `ORA-02292` | `integrity constraint violated - child record found` | Versuch, einen Parent-Datensatz (`DEPT 10`) zu löschen, solange Child Rows in `EMP` existieren | Zuerst Child Rows löschen oder FK mit `ON DELETE CASCADE`/`SET NULL` definieren |
| `ORA-08002` | `sequence SEQ.CURRVAL is not yet defined in this session` | `CURRVAL` wurde vor dem ersten `NEXTVAL` in derselben Session abgefragt | Zuerst mindestens einmal `seq.NEXTVAL` aufrufen |
| `ORA-25154` | `column part of USING clause cannot have qualifier` | `SELECT e.deptno ... JOIN dept d USING (deptno)` geschrieben | Qualifier weglassen: `SELECT deptno` |
