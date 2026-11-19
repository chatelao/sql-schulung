# ORA Error Troubleshooting Dictionary for Beginners

Learning to read `ORA-` errors turns scary red text into exact clues.

| Error Code | Message | Common Beginner Cause | How to Fix |
| :--- | :--- | :--- | :--- |
| `ORA-00904` | `invalid identifier` | Misspelled column name, or referencing a `SELECT` alias in `WHERE` | Check `DESCRIBE table`, or move expression out of alias |
| `ORA-00918` | `column ambiguously defined` | Same column name exists in 2 joined tables without a table alias | Prefix with `e.deptno` or `d.deptno` (unless using `USING`) |
| `ORA-00933` | `SQL command not properly ended` | Missing `AND`, extra comma, or `ORDER BY` placed in first branch of `UNION` | Check commas and move `ORDER BY` to the end |
| `ORA-00942` | `table or view does not exist` | Typo in table name, or missing schema prefix (`scott.emp`) or `SELECT` privilege | Verify schema prefix (`scott.emp`) & permissions |
| `ORA-00979` | `not a GROUP BY expression` | Non-aggregated column in `SELECT` is missing from `GROUP BY` | Add the column to `GROUP BY` or wrap it in `MAX`/`COUNT` |
| `ORA-01400` | `cannot insert NULL into (...)` | Missing value for a `NOT NULL` or `PRIMARY KEY` column | Provide a non-null value in `INSERT` |
| `ORA-01427` | `single-row subquery returns more than one row` | Used `=`, `<`, or `>` with a subquery returning 2+ rows | Switch to `IN`, `ANY`, `ALL`, or aggregate inside subquery |
| `ORA-01722` | `invalid number` | `NVL(comm, 'None')` or comparing number column to non-numeric string | Convert number to string first: `NVL(TO_CHAR(comm), 'None')` |
| `ORA-02292` | `integrity constraint violated - child record found` | Tried to `DELETE` a parent row (`DEPT 10`) while children exist in `EMP` | Delete children first, or define FK with `ON DELETE CASCADE`/`SET NULL` |
| `ORA-08002` | `sequence SEQ.CURRVAL is not yet defined in this session` | Referenced `CURRVAL` before calling `NEXTVAL` in the current session | Call `seq.NEXTVAL` at least once first |
| `ORA-25154` | `column part of USING clause cannot have qualifier` | Wrote `SELECT e.deptno ... JOIN dept d USING (deptno)` | Remove the qualifier: `SELECT deptno` |
