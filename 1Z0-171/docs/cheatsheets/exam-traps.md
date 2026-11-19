# Top 15 `1Z0-171` Exam Traps

1. **`NOT IN` + `NULL` returns 0 rows**: `WHERE empno NOT IN (SELECT mgr FROM scott.emp)` returns **empty set** because `KING` has `mgr = NULL`.
2. **`= NULL` is always UNKNOWN**: Never use `= NULL` or `<> NULL` in `WHERE` or `CASE WHEN`. Only `IS NULL` / `IS NOT NULL` works (except `DECODE`, which treats `NULL = NULL` as equal).
3. **Qualifying a `USING` column fails (`ORA-25154`)**: Never prefix a column named in `JOIN ... USING (deptno)` with `e.` or `d.` anywhere in the query.
4. **`NATURAL JOIN` matches ALL same-named columns**: Joining `HR.EMPLOYEES` and `HR.DEPARTMENTS` naturally joins on **both** `department_id` AND `manager_id`.
5. **Aliases in `WHERE` fail (`ORA-00904`)**: Column aliases are only valid in `ORDER BY`, never in `WHERE`, `GROUP BY`, or `HAVING`.
6. **`NVL` data type mismatch (`ORA-01722`)**: `NVL(comm, 'N/A')` fails because argument 2 is converted to argument 1's type (`NUMBER`).
7. **`CTAS` copies only explicit `NOT NULL`**: `CREATE TABLE copy AS SELECT * FROM emp` does **not** copy `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK`, or `DEFAULT` values.
8. **Any DDL or DCL auto-commits**: Even a failing `CREATE TABLE` that passes parsing triggers an implicit `COMMIT` of your open transaction!
9. **`UNIQUE` allows multiple `NULL`s**: Unlike `PRIMARY KEY`, a `UNIQUE` constraint permits any number of `NULL` rows.
10. **`CURRVAL` requires `NEXTVAL` first**: Calling `my_seq.CURRVAL` in a fresh session without calling `my_seq.NEXTVAL` first raises `ORA-08002`.
11. **`SET` operators use the 1st `SELECT`'s column names**: `ORDER BY` only goes at the very end and must use column names/aliases from the first `SELECT` (or positions).
12. **`REVOKE` Object vs. System Privileges**: Revoking an object privilege granted `WITH GRANT OPTION` **cascades**; revoking a system privilege granted `WITH ADMIN OPTION` **does NOT cascade**.
13. **Nested group functions require `GROUP BY`**: `SELECT MAX(AVG(sal)) FROM emp GROUP BY deptno` is valid; omitting `GROUP BY` or adding `deptno` to `SELECT` fails.
14. **`MERGE ... DELETE WHERE` scope**: Only deletes rows that were **matched and updated** by that `MERGE` statement (evaluating post-update values).
15. **Outer join `WHERE` vs. `ON` filter**: Putting a filter on the right-hand table inside `WHERE` (e.g., `WHERE d.loc = 'DALLAS'`) silently turns a `LEFT OUTER JOIN` back into an `INNER JOIN`!
