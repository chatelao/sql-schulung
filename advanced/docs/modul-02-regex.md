# Modul 2: Regular Expressions in Oracle SQL (`A011`–`A020`)

**Sandbox-Tabellen**: `adv_logs` aus [advanced-queries-sandbox.sql](labs/advanced-queries-sandbox.sql)

---

## 1. Die fünf `REGEXP_*`-Funktionen im Überblick

| Funktion | Zweck | Besonderheit |
| :--- | :--- | :--- |
| `REGEXP_LIKE(src, pat [, match_param])` | Wahrheitswert in `WHERE` oder `CHECK` | Ersetzt komplexe `LIKE`-Ketten |
| `REGEXP_INSTR(src, pat [, pos, occ, ret_opt, param, subexpr])` | Position des Treffers | `ret_opt = 0` (Start), `1` (nach Ende) |
| `REGEXP_SUBSTR(src, pat [, pos, occ, param, subexpr])` | Teilstring extrahieren | `subexpr = 1` liest 1. Capture Group `(...)` |
| `REGEXP_REPLACE(src, pat [, repl, pos, occ, param])` | Suchen & Ersetzen | Backreferences `\1`, `\2` im Ersatztext |
| `REGEXP_COUNT(src, pat [, pos, param])` | Anzahl Treffer zählen | Ideal für Wort-/Token-Zählungen |

### Capture Groups (`subexpr`) in Aktion
```sql
SELECT log_id,
       REGEXP_SUBSTR(raw_line, '\[([A-Z]+)\]', 1, 1, NULL, 1) AS severity,
       REGEXP_SUBSTR(raw_line, 'user=([a-z0-9_]+)', 1, 1, NULL, 1) AS username,
       TO_NUMBER(REGEXP_SUBSTR(raw_line, 'status=([0-9]{3})', 1, 1, NULL, 1)) AS http_status
FROM adv_logs
WHERE REGEXP_LIKE(raw_line, '\[(WARN|ERROR)\]');
```
- **Match-Parameter**: `'i'` (case-insensitive), `'c'` (case-sensitive), `'n'` (`.` matcht auch Zeilenumbruch), `'m'` (`^`/`$` je Zeile).
- **Greedy vs. Non-Greedy**: `.*` frisst so viel wie möglich; `.*?` stoppt beim ersten Treffer des Folgezeichens.

---

## Selbstlern-Aufgaben (Modul 2)

1. **(★)** Extrahiere aus `adv_logs` den API-Pfad nach `path=` (z. B. `/api/orders`).
2. **(★★)** Maskiere in `adv_logs` die letzten beiden Oktette jeder IP-Adresse per `REGEXP_REPLACE` durch `x.x` (z. B. `192.168.x.x`).
3. **(★★★)** Zerlege den CSV-String `'SQL,PLSQL,APEX,JSON'` per `REGEXP_SUBSTR` + `CONNECT BY LEVEL <= REGEXP_COUNT(...) + 1` in 4 einzelne Zeilen.

??? success "Musterlösungen zu Modul 2"
    ```sql
    -- 1:
    SELECT log_id, REGEXP_SUBSTR(raw_line, 'path=([^ ]+)', 1, 1, NULL, 1) AS api_path
    FROM adv_logs;

    -- 2:
    SELECT log_id,
           REGEXP_REPLACE(raw_line, 'ip=([0-9]+\.[0-9]+)\.[0-9]+\.[0-9]+', 'ip=\1.x.x') AS masked_log
    FROM adv_logs;

    -- 3:
    SELECT LEVEL AS pos,
           REGEXP_SUBSTR('SQL,PLSQL,APEX,JSON', '[^,]+', 1, LEVEL) AS token
    FROM dual
    CONNECT BY LEVEL <= REGEXP_COUNT('SQL,PLSQL,APEX,JSON', ',') + 1;
    ```
