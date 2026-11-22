-- =============================================================================
-- Musterloesungen: Oracle SQL Developer Praxis (Module 1 - 6, D001 - D030)
-- Hinweis: Keine Substitution-Zeichen enthalten.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Modul 1 (D004/D005): 50-Zeilen-Fetch vs. Gesamtanzahl pruefen
-- -----------------------------------------------------------------------------
SELECT tx_id, tx_ref_33, amount
FROM sd_transactions
ORDER BY tx_id;

-- -----------------------------------------------------------------------------
-- Modul 3 (D012/D015): Data-Dictionary-Suche nach Spalten und View-Quelltext
-- -----------------------------------------------------------------------------
SELECT table_name, column_name, data_type, data_precision, data_scale
FROM user_tab_columns
WHERE column_name LIKE '%REF%'
   OR column_name LIKE '%POSTAL%'
ORDER BY table_name, column_id;

SELECT view_name, text_length
FROM user_views
WHERE view_name LIKE 'SD_%';

-- -----------------------------------------------------------------------------
-- Modul 4 (D020): Bereinigte 3-Tabellen-LEFT-JOIN-Query (aus Query Builder)
-- -----------------------------------------------------------------------------
SELECT c.customer_name,
       c.postal_code,
       a.iban_like,
       COUNT(t.tx_id)            AS tx_count,
       NVL(SUM(t.amount), 0)     AS total_amount
FROM sd_customers c
JOIN sd_accounts a
  ON c.customer_id = a.customer_id
LEFT JOIN sd_transactions t
  ON a.account_id = t.account_id
GROUP BY c.customer_name, c.postal_code, a.iban_like
ORDER BY c.customer_name, a.iban_like;

-- -----------------------------------------------------------------------------
-- Modul 5 (D024/D025): Output-Hints fuer F5 (Skriptausfuehrung)
-- -----------------------------------------------------------------------------
SELECT /*csv*/
       c.customer_id,
       c.customer_name,
       c.postal_code,
       TO_CHAR(t.tx_ref_33) AS tx_ref_33_txt,
       t.amount
FROM sd_customers c
JOIN sd_accounts a     ON c.customer_id = a.customer_id
JOIN sd_transactions t ON a.account_id  = t.account_id
WHERE t.tx_id <= 5
ORDER BY t.tx_id;

SELECT /*json*/
       customer_id,
       customer_name,
       city
FROM sd_customers
ORDER BY customer_id;

-- -----------------------------------------------------------------------------
-- Modul 6 (D026): Script Output mit SET NUMWIDTH 38 (verhindert E-Form bei F5)
-- -----------------------------------------------------------------------------
SET NUMWIDTH 38
SELECT tx_id, tx_ref_33
FROM sd_transactions
WHERE tx_id <= 4
ORDER BY tx_id;

-- -----------------------------------------------------------------------------
-- Modul 6 (D027/D030): Goldstandard Excel-Export-Query (.xlsx + CSV/PowerQuery)
--   - tx_ref_33 explizit als TO_CHAR -> wird in .xlsx zur echten Textzelle!
--   - postal_code und product_code bleiben VARCHAR2 (fuehrende Nullen / '03-04')
--   - amount bleibt echtes NUMBER -> rechnet in Excel mit =SUMME(...)
--   - booking_ts als ISO-8601 String
--   - memo_text ohne harte Zeilenumbrueche (CHR(10)/CHR(13))
-- -----------------------------------------------------------------------------
SELECT t.tx_id,
       TO_CHAR(t.tx_ref_33)                                 AS tx_ref_33_txt,
       c.customer_name,
       c.postal_code,
       c.city,
       a.iban_like,
       t.product_code,
       t.amount,
       a.currency_code,
       TO_CHAR(t.booking_ts, 'YYYY-MM-DD HH24:MI:SS')       AS booking_ts_iso,
       REPLACE(REPLACE(t.memo_text, CHR(13), ' '), CHR(10), ' ') AS memo_clean
FROM sd_customers c
JOIN sd_accounts a     ON c.customer_id = a.customer_id
JOIN sd_transactions t ON a.account_id  = t.account_id
ORDER BY t.tx_id;

-- Kontrollabfrage vor dem Export: prueft exakt 33 Stellen und fehlende NULLs
SELECT COUNT(*) AS total_rows,
       SUM(CASE WHEN LENGTH(TO_CHAR(tx_ref_33)) = 33 THEN 1 ELSE 0 END) AS exact_33_rows
FROM sd_transactions;
