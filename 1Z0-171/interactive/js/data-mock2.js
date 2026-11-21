// Zweiter unabhängiger 60-Fragen-Pool für Mock Exam #2 (L194-L196)
// Exakt nach 1Z0-171 Domain-Gewichtung: D1=3, D2=9, D3=15, D4=6, D5=3, D6=3, D7=3, D8=9, D9=3, D10=3, D11=3
window.MOCK_EXAM_2_QUESTIONS = [
  // Domain 1 (3 Fragen - 5%)
  { id: "M201", domainId: 1, prompt: "Welche zwei SQL-Befehle gehören zur Transaction Control Language (TCL)?", multi: true, options: ["COMMIT", "TRUNCATE", "SAVEPOINT", "GRANT"], answer: [0, 2], explanation: "COMMIT, ROLLBACK und SAVEPOINT bilden die Transaction Control Language (TCL). TRUNCATE ist DDL, GRANT ist DCL." },
  { id: "M202", domainId: 1, prompt: "Wie wird eine 1:M-Beziehung aus einem Entity-Relationship Diagram (ERD) physisch in relationalen Tabellen abgebildet?", options: ["Durch einen Primary Key auf beiden Seiten ohne Verweis", "Durch einen Foreign Key auf der 'Many'-Seite (Child Table), der auf den Primary Key der 'One'-Seite verweist", "Durch ein CROSS JOIN in der View-Definition", "Durch Speichern aller Child-Werte als kommaseparierten String"], answer: [1], explanation: "In einer 1:M-Beziehung trägt die Child-Tabelle ('Many') die Foreign-Key-Spalte, die auf den PK der Parent-Tabelle ('One') zeigt." },
  { id: "M203", domainId: 1, prompt: "Welche Aussage zu einem RDBMS-Tabellendesign trifft zu?", options: ["Die physische Speicherreihenfolge der Zeilen ist ohne ORDER BY garantiert", "Jede Zeile wird durch einen eindeutigen Primary Key identifiziert (keine Duplikate, kein NULL)", "Spaltennamen dürfen innerhalb derselben Tabelle doppelt vorkommen", "Ein Foreign Key darf niemals NULL sein"], answer: [1], explanation: "Ein Primary Key ist eindeutig und NOT NULL. Ein Foreign Key hingegen darf NULL sein (sofern nicht NOT NULL definiert), und Zeilenreihenfolge ist ohne ORDER BY nicht garantiert." },

  // Domain 2 (9 Fragen - 15%)
  { id: "M204", domainId: 2, prompt: "Was liefert SELECT 'Oracle ' || NULL || '26ai/23ai' FROM dual; zurück?", options: ["NULL", "'Oracle 26ai/23ai'", "ORA-00932", "'Oracle NULL26ai/23ai'"], answer: [1], explanation: "Anders als Arithmetik (+) behandelt der Verkettungsoperator || einen NULL-Wert wie einen leeren String." },
  { id: "M205", domainId: 2, prompt: "Welche Query liefert in SCOTT.EMP alle Mitarbeiter, die weder 'CLERK' noch 'SALESMAN' sind und mindestens 2500 verdienen?", options: [
    "SELECT ename FROM scott.emp WHERE job NOT IN ('CLERK', 'SALESMAN') AND sal >= 2500;",
    "SELECT ename FROM scott.emp WHERE job <> 'CLERK' OR job <> 'SALESMAN' AND sal >= 2500;",
    "SELECT ename FROM scott.emp WHERE NOT job = 'CLERK' AND sal >= 2500;",
    "SELECT ename FROM scott.emp WHERE job != ('CLERK', 'SALESMAN') AND sal >= 2500;"
  ], answer: [0], explanation: "NOT IN ('CLERK', 'SALESMAN') schließt beide Jobs sauber aus; <> akzeptiert keine Werteliste." },
  { id: "M206", domainId: 2, prompt: "Was ist das Ergebnis von: SELECT ename FROM scott.emp WHERE deptno = 20 ORDER BY sal DESC FETCH FIRST 1 ROW ONLY;", options: ["SMITH", "JONES", "SCOTT oder FORD (einer von beiden, da beide 3000 verdienen)", "Sowohl SCOTT als auch FORD (2 Zeilen)"], answer: [2], explanation: "ONLY liefert exakt 1 Zeile. Da SCOTT und FORD beide 3000 verdienen, bricht ONLY nach 1 Zeile ab (für beide wäre WITH TIES nötig)." },
  { id: "M207", domainId: 2, prompt: "Welche Aussage über DATE-Literale in Oracle SQL ist richtig?", options: ["DATE '20-02-1981' ist das gültige ANSI-Format", "DATE '1981-02-20' nutzt das verbindliche ANSI-Format 'YYYY-MM-DD'", "DATE '1981-02-20 14:00:00' ist ein gültiges DATE-Literal", "DATE-Literale hängen von NLS_DATE_FORMAT ab"], answer: [1], explanation: "Das ANSI DATE-Literal verlangt exakt 'YYYY-MM-DD' ohne Uhrzeit und ist unabhängig von NLS-Einstellungen." },
  { id: "M208", domainId: 2, prompt: "Warum liefert SELECT ename FROM scott.emp WHERE comm <> NULL; 0 Zeilen?", options: ["Weil alle Mitarbeiter comm = 0 haben", "Weil jeder Vergleich mit NULL (auch <>) zu UNKNOWN auswertet", "Weil comm ein VARCHAR2 ist", "Weil <> in Oracle veraltet ist"], answer: [1], explanation: "Vergleiche mit = NULL oder <> NULL ergeben immer UNKNOWN. Nur IS NOT NULL prüft auf vorhandene Werte." },
  { id: "M209", domainId: 2, prompt: "Wie sortierst du SCOTT.EMP nach der Provision absteigend, sodass NULL-Werte GANZ UNTEN erscheinen?", options: ["ORDER BY comm DESC", "ORDER BY comm DESC NULLS LAST", "ORDER BY comm ASC NULLS FIRST", "ORDER BY NULLS LAST comm DESC"], answer: [1], explanation: "Standardmäßig setzt DESC NULL-Werte nach oben (NULLS FIRST). Mit NULLS LAST stehen sie ganz unten." },
  { id: "M210", domainId: 2, prompt: "Welche Query nutzt den Column Alias korrekt?", options: [
    "SELECT ename, sal * 12 AS 'Jahresgehalt' FROM scott.emp;",
    "SELECT ename, sal * 12 AS \"Jahres Gehalt\" FROM scott.emp ORDER BY \"Jahres Gehalt\";",
    "SELECT ename, sal * 12 AS annual FROM scott.emp WHERE annual > 20000;",
    "SELECT ename, sal * 12 AS annual_pay FROM scott.emp GROUP BY annual_pay;"
  ], answer: [1], explanation: "Aliases mit Leerzeichen erfordern \"Double Quotes\" und sind erst ab ORDER BY sichtbar (nicht in WHERE oder GROUP BY)." },
  { id: "M211", domainId: 2, prompt: "In SQL*Plus führst du zweimal hintereinander SELECT ename FROM scott.emp WHERE deptno = &d; aus. Was passiert?", options: ["Du wirst nur beim ersten Mal nach d gefragt", "Du wirst bei jeder Ausführung erneut nach d gefragt", "d wird automatisch per DEFINE gespeichert", "Es tritt ein Fehler auf, weil && fehlt"], answer: [1], explanation: "Ein einfaches & speichert keinen Wert in der Session und fragt bei jeder Ausführung erneut nach." },
  { id: "M212", domainId: 2, prompt: "Wie löschst du in SQL*Plus eine per DEFINE oder && gesetzte Session-Variable target_dept?", options: ["DELETE target_dept;", "UNDEFINE target_dept", "RESET target_dept;", "SET target_dept NULL"], answer: [1], explanation: "UNDEFINE entfernt eine definierte Substitution Variable aus der aktuellen Session." },

  // Domain 3 (15 Fragen - 25%)
  { id: "M213", domainId: 3, prompt: "Was liefert SELECT SUBSTR('DATABASE', -5, 3) FROM dual; zurück?", options: ["'ABA'", "'BAS'", "'TAB'", "'ASE'"], answer: [0], explanation: "Von hinten gezählt: E=-1, S=-2, A=-3, B=-4, A=-5. Ab Pos. -5 ('A') drei Zeichen nach rechts -> 'ABA'." },
  { id: "M214", domainId: 3, prompt: "Was liefert SELECT REPLACE('BANANA', 'NA') FROM dual; zurück?", options: ["'BA'", "'BA  '", "NULL", "ORA-00909"], answer: [0], explanation: "Ohne das 3. Argument entfernt REPLACE alle Vorkommen des Suchstrings ('NA' fällt weg -> 'BA')." },
  { id: "M215", domainId: 3, prompt: "Was liefert SELECT ROUND(DATE '2026-03-16', 'MONTH') FROM dual; zurück?", options: ["2026-03-01", "2026-04-01", "2026-03-16", "2026-03-31"], answer: [1], explanation: "ROUND(date, 'MONTH') rundet ab dem 16. Tag des Monats auf den 1. des Folgemonats auf (2026-04-01)." },
  { id: "M216", domainId: 3, prompt: "Was liefert SELECT TRUNC(DATE '2026-11-20', 'YEAR') FROM dual; zurück?", options: ["2027-01-01", "2026-01-01", "2026-11-01", "2026-12-31"], answer: [1], explanation: "TRUNC(date, 'YEAR') schneidet immer auf den 1. Januar desselben Jahres zurück (2026-01-01)." },
  { id: "M217", domainId: 3, prompt: "Welches Ergebnis hat SELECT ROUND(45.926, -1), TRUNC(45.926, -1) FROM dual;?", options: ["50 | 40", "46 | 45", "50 | 45", "40 | 40"], answer: [0], explanation: "ROUND(..., -1) rundet 45.926 auf den nächsten Zehner (50); TRUNC(..., -1) schneidet auf 40 ab." },
  { id: "M218", domainId: 3, prompt: "Was liefert SELECT LENGTH(TO_CHAR(DATE '2026-04-05', 'MONTH')) FROM dual; (NLS_DATE_LANGUAGE=AMERICAN)?", options: ["5", "9", "4", "10"], answer: [1], explanation: "Ohne 'fm' polstert Oracle MONTH auf die Länge des längsten Monatsnamens ('SEPTEMBER' = 9 Zeichen) mit Leerzeichen auf." },
  { id: "M219", domainId: 3, prompt: "Welcher Format-Modifier erzwingt bei TO_DATE eine exakte Übereinstimmung von Trennzeichen und führenden Nullen?", options: ["fm", "fx", "RR", "MI"], answer: [1], explanation: "fx (Format Exact) verbietet abweichende Trennzeichen und fehlende führende Nullen." },
  { id: "M220", domainId: 3, prompt: "Welche Aussage über NVL(expr1, expr2) ist FALSCH?", options: ["Wenn expr1 NULL ist, wird expr2 zurückgegeben", "expr2 wird in den Datentyp von expr1 konvertiert", "NVL akzeptiert auch 3 Argumente", "NVL(comm, 0) verhindert NULL in Summen"], answer: [2], explanation: "NVL akzeptiert exakt 2 Argumente (für 3 Argumente gibt es NVL2 oder COALESCE)." },
  { id: "M221", domainId: 3, prompt: "Was liefert SELECT COALESCE(NULL, NULL, 'OK', 'BACKUP') FROM dual;?", options: ["NULL", "'OK'", "'BACKUP'", "ORA-00932"], answer: [1], explanation: "COALESCE liefert den ersten Nicht-NULL-Ausdruck von links nach rechts ('OK') und stoppt dann (Short-Circuit)." },
  { id: "M222", domainId: 3, prompt: "Was passiert bei SELECT NULLIF(NULL, 10) FROM dual;?", options: ["Liefert NULL", "Liefert 10", "Wirft ORA-00932: inconsistent datatypes", "Liefert 0"], answer: [2], explanation: "Das erste Argument von NULLIF darf nicht das untypisierte Literal NULL sein." },
  { id: "M223", domainId: 3, prompt: "Was liefert SELECT CASE NULL WHEN NULL THEN 'A' ELSE 'B' END FROM dual;?", options: ["'A'", "'B'", "NULL", "ORA-00932"], answer: [1], explanation: "Simple CASE prüft NULL = NULL, was UNKNOWN ergibt — daher greift der ELSE-Zweig ('B')." },
  { id: "M224", domainId: 3, prompt: "Welche Aggregate Function zählt auch Zeilen mit NULL-Werten in einer Spalte?", options: ["COUNT(comm)", "COUNT(DISTINCT comm)", "COUNT(*)", "AVG(comm)"], answer: [2], explanation: "COUNT(*) zählt alle Zeilen inklusive NULL-Zeilen; COUNT(col) und AVG(col) ignorieren NULLs." },
  { id: "M225", domainId: 3, prompt: "Warum wirft SELECT job, COUNT(*) FROM scott.emp HAVING COUNT(*) > 2; einen Fehler?", options: ["GROUP BY job fehlt (ORA-00937)", "HAVING darf nicht mit COUNT(*) verwendet werden", "COUNT(*) erfordert eine Spalte", "Es wird kein Fehler geworfen"], answer: [0], explanation: "Die unaggregierte Spalte job erfordert GROUP BY job." },
  { id: "M226", domainId: 3, prompt: "Welche Query ist syntaktisch GÜLTIG in Oracle SQL?", options: [
    "SELECT deptno, MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;",
    "SELECT MAX(AVG(sal)) FROM scott.emp GROUP BY deptno;",
    "SELECT MAX(AVG(SUM(sal))) FROM scott.emp GROUP BY deptno;",
    "SELECT MAX(AVG(sal)) FROM scott.emp;"
  ], answer: [1], explanation: "Verschachtelte Group Functions sind bis Tiefe 2 gültig, erfordern GROUP BY und verbieten unaggregierte Spalten im SELECT." },
  { id: "M227", domainId: 3, prompt: "Was liefert SELECT NEXT_DAY(DATE '2026-11-20', 'FRIDAY') FROM dual; (2026-11-20 ist ein Freitag)?", options: ["2026-11-20", "2026-11-27", "2026-11-21", "2026-11-13"], answer: [1], explanation: "NEXT_DAY liefert immer das Datum des nächsten genannten Wochentags STRIKT NACH dem Ausgangsdatum (+7 Tage, wenn es derselbe Tag ist)." },

  // Domain 4 (6 Fragen - 10%)
  { id: "M228", domainId: 4, prompt: "Welche Query wirft ORA-25154?", options: [
    "SELECT e.ename, deptno, d.dname FROM scott.emp e JOIN scott.dept d USING (deptno);",
    "SELECT e.ename, e.deptno, d.dname FROM scott.emp e JOIN scott.dept d USING (deptno);",
    "SELECT e.ename, e.deptno, d.dname FROM scott.emp e JOIN scott.dept d ON e.deptno = d.deptno;",
    "SELECT ename, dname FROM scott.emp NATURAL JOIN scott.dept;"
  ], answer: [1], explanation: "Bei USING (deptno) darf deptno nirgendwo mit e. oder d. qualifiziert werden (ORA-25154)." },
  { id: "M229", domainId: 4, prompt: "Was ist der Unterschied zwischen INNER JOIN und FULL OUTER JOIN auf SCOTT.EMP (14) und SCOTT.DEPT (4, davon Dept 40 leer)?", options: [
    "Beide liefern 14 Zeilen",
    "INNER JOIN liefert 14 Zeilen; FULL OUTER JOIN liefert 15 Zeilen (inkl. DEPT 40 mit NULL-Mitarbeiter)",
    "FULL OUTER JOIN liefert 56 Zeilen",
    "FULL OUTER JOIN erfordert eine USING-Klausel"
  ], answer: [1], explanation: "FULL OUTER JOIN bewahrt auch das leere Department 40 OPERATIONS auf der rechten Seite -> 15 Zeilen." },
  { id: "M230", domainId: 4, prompt: "Wie viele Tabellen-Aliases brauchst du mindestens für einen Self-Join auf SCOTT.EMP?", options: ["1", "2 (z. B. e und m)", "3", "Gar keinen"], answer: [1], explanation: "Bei einem Self-Join wird dieselbe Tabelle zweimal referenziert; unterschiedliche Aliases (e, m) sind Pflicht." },
  { id: "M231", domainId: 4, prompt: "Welche Join-Art wählst du, wenn zwei Tabellen über e.sal BETWEEN s.losal AND s.hisal verknüpft werden sollen?", options: ["NATURAL JOIN", "JOIN ... USING", "JOIN ... ON (Non-Equijoin)", "CROSS JOIN"], answer: [2], explanation: "Ungleichheits- oder Bereichsbedingungen sind nur mit JOIN ... ON möglich." },
  { id: "M232", domainId: 4, prompt: "Warum liefert HR.EMPLOYEES NATURAL JOIN HR.DEPARTMENTS weniger Zeilen als erwartet?", options: [
    "Weil NATURAL JOIN nur 10 Zeilen erlaubt",
    "Weil beide Tabellen sowohl DEPARTMENT_ID als auch MANAGER_ID teilen und auf BEIDE Spalten gejoint wird",
    "Weil NATURAL JOIN ein Cartesian Product bildet",
    "Weil HR keine Primary Keys hat"
  ], answer: [1], explanation: "NATURAL JOIN verknüpft automatisch über alle namensgleichen Spalten (DEPARTMENT_ID und MANAGER_ID)." },
  { id: "M233", domainId: 4, prompt: "Wo muss ein Filter auf die optionale rechte Tabelle (e.job = 'CLERK') stehen, damit DEPT 40 bei scott.dept d LEFT JOIN scott.emp e erhalten bleibt?", options: ["In der WHERE-Klausel", "In der ON-Klausel des LEFT JOIN", "In HAVING", "In ORDER BY"], answer: [1], explanation: "Ein Filter in WHERE verwirft die mit NULL aufgefüllten Zeilen; in ON bleibt DEPT 40 erhalten." },

  // Domain 5 (3 Fragen - 5%)
  { id: "M234", domainId: 5, prompt: "Was passiert, wenn eine Subquery in WHERE sal = (SELECT sal FROM scott.emp WHERE ename = 'NOBODY') 0 Zeilen liefert?", options: ["Wirft ORA-01403: no data found", "Wertet zu NULL aus -> äußere Query liefert 0 Zeilen ohne Fehler", "Wirft ORA-01427", "Liefert alle 14 Zeilen"], answer: [1], explanation: "In SQL liefert eine leere Scalar Subquery NULL; der Vergleich sal = NULL ist UNKNOWN -> 0 Zeilen." },
  { id: "M235", domainId: 5, prompt: "Was bedeutet sal < ALL (1000, 2000, 3000)?", options: ["sal < 3000", "sal < 1000 (kleiner als das Minimum)", "sal = 1000", "sal > 3000"], answer: [1], explanation: "< ALL bedeutet kleiner als jeder Wert in der Menge, also kleiner als das Minimum (1000)." },
  { id: "M236", domainId: 5, prompt: "Welche zwei Aussagen zu Correlated Subqueries sind WAHR?", multi: true, options: [
    "Die innere Query referenziert eine Spalte der äußeren Query",
    "Die innere Query wird garantiert nur exakt einmal vor der äußeren Query ausgeführt",
    "Sie lassen sich häufig mit EXISTS / NOT EXISTS kombinieren",
    "Sie sind nur in DDL erlaubt"
  ], answer: [0, 2], explanation: "Correlated Subqueries beziehen sich auf eine äußere Spalte und werden logisch pro Kandidatenzeile ausgewertet." },

  // Domain 6 (3 Fragen - 5%)
  { id: "M237", domainId: 6, prompt: "Welcher SET Operator behält Duplikate bei und sortiert das Ergebnis nicht?", options: ["UNION", "UNION ALL", "INTERSECT", "MINUS"], answer: [1], explanation: "UNION ALL führt keine Deduplizierung und keine Sortierung durch." },
  { id: "M238", domainId: 6, prompt: "Aus welchem SELECT stammen die Spaltennamen einer Compound Query mit UNION?", options: ["Vom letzten SELECT", "Vom ersten SELECT", "Aus einer Kombination beider", "Sie heißen COL1, COL2"], answer: [1], explanation: "Die Spaltenüberschriften einer Compound Query stammen immer vom ersten SELECT." },
  { id: "M239", domainId: 6, prompt: "T1 hat {1, 2, 3, 3} und T2 hat {2, 4}. Was liefert SELECT x FROM T1 MINUS SELECT x FROM T2;?", options: ["{1, 3}", "{1, 3, 3}", "{4}", "{1, 2, 3, 4}"], answer: [0], explanation: "MINUS entfernt Duplikate und liefert alle eindeutigen Werte aus T1, die nicht in T2 stehen -> {1, 3}." },

  // Domain 7 (3 Fragen - 5%)
  { id: "M240", domainId: 7, prompt: "Was passiert mit offenen DML-Änderungen, wenn du direkt danach ALTER TABLE my_emp ADD note VARCHAR2(20); ausführst?", options: ["Sie werden automatisch zurückgerollt", "Sie werden durch das DDL-Statement implizit committet", "ALTER TABLE schlägt fehl bis zum manuellen COMMIT", "Sie bleiben uncommittet"], answer: [1], explanation: "Jedes DDL Statement löst vor und nach der Ausführung ein implizites COMMIT aus." },
  { id: "M241", domainId: 7, prompt: "In einem bedingten INSERT ALL mit 2 WHEN-Klauseln erfüllt eine Zeile BEIDE Bedingungen. Wie oft wird sie eingefügt?", options: ["1-mal (nur erste WHEN-Klausel)", "2-mal (in beide Zieltabellen)", "0-mal", "Wirft einen Fehler"], answer: [1], explanation: "INSERT ALL prüft jede WHEN-Klausel unabhängig (im Gegensatz zu INSERT FIRST)." },
  { id: "M242", domainId: 7, prompt: "Wozu dient SELECT ... FROM my_emp WHERE deptno = 10 FOR UPDATE NOWAIT;?", options: [
    "Es löscht die Zeilen sofort",
    "Es sperrt die Zeilen für Änderungen und bricht sofort mit ORA-00054 ab, falls bereits eine Sperre vorliegt",
    "Es macht ein automatisches COMMIT",
    "Es verhindert, dass andere Sessions die Zeilen lesen können"
  ], answer: [1], explanation: "FOR UPDATE setzt Row Locks; NOWAIT wartet nicht auf fremde Locks, sondern meldet sofort ORA-00054." },

  // Domain 8 (9 Fragen - 15%)
  { id: "M243", domainId: 8, prompt: "Welche Aussage über Oracle 26ai/23ai BOOLEAN in CREATE TABLE ist wahr?", options: [
    "BOOLEAN existiert in Oracle 26ai/23ai nur in PL/SQL, nicht als Tabellenspalte",
    "BOOLEAN kann direkt als Spaltentyp in CREATE TABLE verwendet werden (TRUE/FALSE/NULL)",
    "BOOLEAN speichert nur 'Y' oder 'N'",
    "BOOLEAN ist ein Alias für NUMBER(1)"
  ], answer: [1], explanation: "Oracle Database 26ai/23ai unterstützt den nativen SQL-Datentyp BOOLEAN direkt in Tabellen und Abfragen." },
  { id: "M244", domainId: 8, prompt: "Welche Daten werden bei CREATE TABLE emp_empty AS SELECT * FROM scott.emp WHERE 1 = 0; erstellt?", options: [
    "Alle 14 Zeilen + alle Constraints",
    "Die Tabellenstruktur (Spaltennamen/Typen + explizite NOT NULLs) mit 0 Zeilen",
    "Ein Fehler, weil 1 = 0 falsch ist",
    "Eine View statt einer Table"
  ], answer: [1], explanation: "WHERE 1 = 0 ist ein klassisches Idiom, um nur das Tabellengerüst ohne Daten zu kopieren." },
  { id: "M245", domainId: 8, prompt: "Wann darfst du ALTER TABLE t MODIFY (col VARCHAR2(10)) auf eine bestehende VARCHAR2(50)-Spalte ausführen?", options: [
    "Niemals, Verkleinern ist verboten",
    "Wenn die Tabelle leer ist oder alle vorhandenen Werte höchstens 10 Zeichen/Bytes lang sind",
    "Immer, Oracle schneidet längere Texte automatisch ab",
    "Nur nach TRUNCATE TABLE"
  ], answer: [1], explanation: "Verkleinern ist erlaubt, solange kein gespeicherter Wert die neue Maximallänge überschreitet." },
  { id: "M246", domainId: 8, prompt: "Was bewirkt DROP TABLE parent_tbl CASCADE CONSTRAINTS PURGE;?", options: [
    "Löscht parent_tbl und alle Child-Tabellen gleich mit",
    "Entfernt referenzierende Foreign-Key-Constraints auf Child-Tabellen und löscht parent_tbl endgültig ohne Recycle Bin",
    "Schlägt fehl, solange Child-Tabellen existieren",
    "Verschiebt parent_tbl in den Recycle Bin"
  ], answer: [1], explanation: "CASCADE CONSTRAINTS löscht nur die FK-Constraints der Kinder (nicht die Child-Tabellen selbst); PURGE umgeht den Recycle Bin." },
  { id: "M247", domainId: 8, prompt: "Wann wird ein DEFERRABLE INITIALLY DEFERRED Constraint geprüft?", options: [
    "Sofort nach jedem INSERT/UPDATE",
    "Erst beim COMMIT der Transaktion",
    "Gar nicht",
    "Nur beim ALTER TABLE"
  ], answer: [1], explanation: "INITIALLY DEFERRED verschiebt die Constraint-Prüfung bis zum COMMIT." },
  { id: "M248", domainId: 8, prompt: "Wann endet die Lebensdauer der Daten in einer Global Temporary Table mit ON COMMIT PRESERVE ROWS?", options: [
    "Beim nächsten COMMIT",
    "Am Ende der Datenbank-Session (für andere Sessions ohnehin unsichtbar)",
    "Sofort nach dem SELECT",
    "Erst bei DROP TABLE"
  ], answer: [1], explanation: "ON COMMIT PRESERVE ROWS behält die privaten Session-Daten über COMMITs hinweg bis zum Session-Ende." },
  { id: "M249", domainId: 8, prompt: "Wozu dient CREATE FORCE VIEW v_test AS SELECT * FROM future_tbl;?", options: [
    "Erzwingt Schreibrechte auf future_tbl",
    "Legt die View-Definition im Dictionary an, auch wenn future_tbl noch nicht existiert (Status INVALID)",
    "Erstellt future_tbl automatisch mit",
    "Erlaubt DML auf Complex Views"
  ], answer: [1], explanation: "FORCE erstellt die View trotz fehlender Basistabelle oder fehlender Rechte (zunächst im Status INVALID)." },
  { id: "M250", domainId: 8, prompt: "Welche View erlaubt KEIN DELETE über die View?", options: [
    "CREATE VIEW v1 AS SELECT empno, ename, sal FROM my_emp WHERE deptno = 10;",
    "CREATE VIEW v2 AS SELECT deptno, COUNT(*) cnt FROM my_emp GROUP BY deptno;",
    "CREATE VIEW v3 AS SELECT empno, ename FROM my_emp WITH CHECK OPTION;",
    "CREATE OR REPLACE VIEW v4 AS SELECT empno, sal FROM my_emp;"
  ], answer: [1], explanation: "Views mit GROUP BY, DISTINCT, Group Functions oder SET Operators sind nicht DML-fähig." },
  { id: "M251", domainId: 8, prompt: "Was passiert, wenn du eine Zeile über eine View mit WITH READ ONLY aktualisierst?", options: ["Aktualisiert die Basistabelle", "Schlägt fehl (ORA-42399: cannot perform a DML operation on a read-only view)", "Erstellt eine neue Zeile", "Ignoriert das UPDATE stillschweigend"], answer: [1], explanation: "WITH READ ONLY blockiert jedes INSERT, UPDATE und DELETE über diese View." },

  // Domain 9 (3 Fragen - 5%)
  { id: "M252", domainId: 9, prompt: "Wann ist ein Function-Based Index wie CREATE INDEX idx_u ON my_emp(UPPER(ename)); besonders hilfreich?", options: [
    "Bei WHERE UPPER(ename) = 'SMITH'",
    "Bei WHERE ename = 'SMITH'",
    "Bei TRUNCATE TABLE my_emp",
    "Er verhindert doppelte Werte automatisch"
  ], answer: [0], explanation: "Ein normaler Index auf ename wird bei UPPER(ename) meist nicht genutzt; der Function-Based Index passt exakt zum Ausdruck." },
  { id: "M253", domainId: 9, prompt: "Welche Option bei CREATE SEQUENCE verhindert das vorab gecachte Reservieren von Werten im Speicher?", options: ["NOCYCLE", "NOCACHE", "NOMAXVALUE", "ORDER"], answer: [1], explanation: "NOCACHE speichert keine Sequenzwerte vorab im Shared Pool (Standard ohne Angabe ist CACHE 20)." },
  { id: "M254", domainId: 9, prompt: "Welche Aussage über einen INVISIBLE Index ist richtig?", options: [
    "Er wird bei INSERT/UPDATE/DELETE nicht gepflegt",
    "Er wird bei DML gepflegt, aber vom Optimizer standardmäßig ignoriert",
    "Er ist nur für SYS sichtbar",
    "Er kann nicht auf UNIQUE-Spalten angelegt werden"
  ], answer: [1], explanation: "Invisible Indexes werden bei DML aktuell gehalten, aber vom Optimizer erst genutzt, wenn man sie sichtbar macht oder den Session-Parameter setzt." },

  // Domain 10 (3 Fragen - 5%)
  { id: "M255", domainId: 10, prompt: "Warum liefert SELECT * FROM user_tables WHERE table_name = 'my_emp'; 0 Zeilen?", options: [
    "USER_TABLES existiert nicht",
    "Objektnamen werden im Data Dictionary standardmäßig in GROSSBUCHSTABEN ('MY_EMP') gespeichert",
    "USER_TABLES zeigt nur Views",
    "Man braucht DBA-Rechte für USER_TABLES"
  ], answer: [1], explanation: "Ohne Double Quotes bei CREATE TABLE speichert Oracle alle Objektnamen in UPPERCASE ('MY_EMP')." },
  { id: "M256", domainId: 10, prompt: "Welche Data-Dictionary-View zeigt alle Kommentare, die du mit COMMENT ON TABLE angelegt hast?", options: ["USER_TAB_COMMENTS", "USER_OBJECTS", "USER_CONSTRAINTS", "USER_VIEWS"], answer: [0], explanation: "Tabellenkommentare stehen in USER_TAB_COMMENTS (Spaltenkommentare in USER_COL_COMMENTS)." },
  { id: "M257", domainId: 10, prompt: "Was liefert SELECT EXTRACT(MONTH FROM DATE '2026-11-20') FROM dual;?", options: ["'NOV'", "11", "'NOVEMBER'", "2026"], answer: [1], explanation: "EXTRACT liefert eine Zahl (hier 11 für November)." },

  // Domain 11 (3 Fragen - 5%)
  { id: "M258", domainId: 11, prompt: "Was ist ein System Privilege (im Unterschied zu einem Object Privilege)?", options: [
    "SELECT ON scott.emp",
    "CREATE TABLE oder CREATE SESSION",
    "UPDATE (sal) ON my_emp",
    "REFERENCES ON scott.dept"
  ], answer: [1], explanation: "CREATE SESSION, CREATE TABLE, CREATE VIEW sind System Privileges (Aktionen in der DB, nicht auf einem einzelnen Objekt)." },
  { id: "M259", domainId: 11, prompt: "Welcher Befehl ändert das Passwort eines bestehenden Datenbank-Users alice?", options: [
    "UPDATE USER alice SET PASSWORD = 'New123!';",
    "ALTER USER alice IDENTIFIED BY New123!;",
    "GRANT PASSWORD New123! TO alice;",
    "MODIFY USER alice PASSWORD New123!;"
  ], answer: [1], explanation: "Passwörter werden mit ALTER USER <name> IDENTIFIED BY <passwort>; geändert." },
  { id: "M260", domainId: 11, prompt: "Wie entziehst du einer Role hr_reader das Recht SELECT ON scott.emp wieder?", options: [
    "DROP SELECT ON scott.emp FROM hr_reader;",
    "REVOKE SELECT ON scott.emp FROM hr_reader;",
    "ALTER ROLE hr_reader REMOVE SELECT;",
    "DENY SELECT ON scott.emp TO hr_reader;"
  ], answer: [1], explanation: "Rechte werden sowohl von Usern als auch von Roles mit REVOKE ... FROM ... entzogen." }
];
