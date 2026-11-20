# SQL\*Plus Substitution Variables — Spool-Transkripte (Variante-B-Brücke)

In der `1Z0-171`-Prüfung wird abgefragt, wie sich die Kommandozeilen-Werkzeuge **`sqlplus` / `sqlcl`** bei `&`, `&&`, `DEFINE`, `UNDEFINE` und `SET VERIFY ON/OFF` verhalten. Browser-Worksheets wie Oracle FreeSQL nutzen dafür teils Web-Popups oder zeigen keine `old:`/`new:`-Zeilen.

Nutze diese kommentierten Original-Transkripte zusammen mit unserem interaktiven **[SQL\*Plus Simulator auf GitHub Pages](https://chatelao.github.io/sql-schulung/#labs/sqlplus)**.

---

## 1. Einfaches `&` (Single Ampersand) mit `SET VERIFY ON`

`&var` fragt **bei jeder Ausführung** erneut nach und speichert den Wert nicht in der Session.

```text
SQL> SET VERIFY ON
SQL> SELECT empno, ename, sal
  2  FROM scott.emp
  3  WHERE deptno = &dept_num
  4    AND job = '&target_job';
Enter value for dept_num: 30
old   3: WHERE deptno = &dept_num
new   3: WHERE deptno = 30
Enter value for target_job: SALESMAN
old   4:   AND job = '&target_job'
new   4:   AND job = 'SALESMAN'

     EMPNO ENAME             SAL
---------- ---------- ----------
      7499 ALLEN            1600
      7521 WARD             1250
      7654 MARTIN           1250
      7844 TURNER           1500
```

> **Exam Trap (Quotes bei Strings!)**: `&target_job` wird rein textuell ersetzt. Ohne `'&target_job'` in SQL erzeugt die Eingabe `SALESMAN` ungültiges SQL (`WHERE job = SALESMAN` → `ORA-00904: "SALESMAN": invalid identifier`).

---

## 2. Doppeltes `&&` (Double Ampersand) & Session-Persistenz

`&&var` fragt **genau einmal**, definiert die Variable automatisch per `DEFINE` und verwendet sie bei jedem weiteren `&var` oder `&&var` in derselben Session wieder.

```text
SQL> SELECT empno, ename, &&sort_col
  2  FROM scott.emp
  3  WHERE deptno = 10
  4  ORDER BY &sort_col DESC;
Enter value for sort_col: sal
old   1: SELECT empno, ename, &&sort_col
new   1: SELECT empno, ename, sal
old   4: ORDER BY &sort_col DESC
new   4: ORDER BY sal DESC

     EMPNO ENAME             SAL
---------- ---------- ----------
      7839 KING             5000
      7782 CLARK            2450
      7934 MILLER           1300

-- Zweite Ausführung derselben Query: KEINE erneute Abfrage, da sort_col definiert bleibt!
SQL> DEFINE sort_col
DEFINE SORT_COL        = "sal" (CHAR)
```

---

## 3. `DEFINE`, `UNDEFINE` & `SET VERIFY OFF`

```text
SQL> DEFINE target_dept = 20
SQL> SET VERIFY OFF
SQL> SELECT ename, sal FROM scott.emp WHERE deptno = &target_dept;

ENAME             SAL
---------- ----------
SMITH             800
JONES            2975
SCOTT            3000
ADAMS            1100
FORD             3000

SQL> UNDEFINE target_dept
SQL> DEFINE target_dept
SP2-0135: symbol target_dept is undefined
```

### Prüfungs-Checkliste zu Substitution Variables
- `SET VERIFY ON` druckt `old <zeile>:` und `new <zeile>:` — `SET VERIFY OFF` unterdrückt diese Ausgabe.
- `&&` legt eine Session-Variable an; `&` nicht.
- `UNDEFINE var` löscht eine mit `DEFINE` oder `&&` gesetzte Variable; danach fragt `sqlplus` beim nächsten `&var` wieder nach.
- Alle Substitution Variables verschwinden automatisch beim Beenden (`EXIT`) der Session.
