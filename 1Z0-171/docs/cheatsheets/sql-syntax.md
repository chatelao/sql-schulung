# SQL Syntax & Logical Execution Order Cheat Sheet

## Logical Query Processing Order vs. Written Order

Even though you **write** a query top-to-bottom starting with `SELECT`, Oracle **evaluates** clauses in a strict logical sequence:

| Execution Step | Clause | What Happens | Alias Visibility |
| :---: | :--- | :--- | :--- |
| **1** | `FROM` / `JOIN` | Identify tables and combine rows | Table aliases created here |
| **2** | `WHERE` | Filter individual rows | Column aliases from `SELECT` **NOT** visible! |
| **3** | `GROUP BY` | Collapse rows into groups | Column aliases from `SELECT` **NOT** visible! |
| **4** | `HAVING` | Filter groups | Column aliases from `SELECT` **NOT** visible! |
| **5** | `SELECT` | Compute expressions, functions & `DISTINCT` | Column aliases created here |
| **6** | `ORDER BY` | Sort output rows | Column aliases **ARE** visible! |
| **7** | `OFFSET` / `FETCH` | Limit returned rows | Uses sorted order from step 6 |

---

## Boolean & Arithmetic Operator Precedence

1. Parentheses `( )`
2. Multiplication `*` / Division `/`
3. Addition `+` / Subtraction `-` / Concatenation `||`
4. Comparison operators (`=`, `<>`, `<`, `>`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`)
5. `NOT`
6. `AND`
7. `OR`

!!! tip "Exam Rule of Thumb"
    `AND` binds tighter than `OR`! Always wrap `OR` conditions in parentheses when mixing with `AND`.
