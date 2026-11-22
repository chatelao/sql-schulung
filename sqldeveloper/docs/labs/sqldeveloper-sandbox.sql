-- =============================================================================
-- Oracle SQL Developer Praxis Sandbox (Module 1 - 6, D001 - D030)
-- Kompatibel mit Oracle AI Database 26ai / 23ai Free, PDB_TRAINING und FreeSQL
-- Hinweis: Keine Substitution-Zeichen enthalten (kein interaktiver Prompt).
-- =============================================================================

-- Cleanup (idempotent: auch beim allerersten Durchlauf fehlerfrei)
BEGIN EXECUTE IMMEDIATE 'DROP VIEW sd_v_tx_export';          EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE sd_transactions PURGE';  EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE sd_accounts PURGE';      EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE sd_customers PURGE';     EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- -----------------------------------------------------------------------------
-- 1. Tabellen mit expliziten PK/FK-Constraints (fuer Drag-and-Drop + Modell-ERD)
-- -----------------------------------------------------------------------------
CREATE TABLE sd_customers (
  customer_id   NUMBER(10)    CONSTRAINT pk_sd_customers PRIMARY KEY,
  customer_name VARCHAR2(80)  NOT NULL,
  postal_code   VARCHAR2(10)  NOT NULL, -- Fuehrende Nullen! (z. B. '01067')
  city          VARCHAR2(50)  NOT NULL, -- Umlaute fuer UTF-8-Check
  tax_note      VARCHAR2(100)           -- Bewusst NULL-Werte fuer Grid-NULL-Test
);

CREATE TABLE sd_accounts (
  account_id    NUMBER(10)    CONSTRAINT pk_sd_accounts PRIMARY KEY,
  customer_id   NUMBER(10)    NOT NULL
                              CONSTRAINT fk_sd_acc_cust REFERENCES sd_customers(customer_id),
  iban_like     VARCHAR2(34)  NOT NULL,
  currency_code VARCHAR2(3)   NOT NULL,
  opened_date   DATE          NOT NULL
);

CREATE TABLE sd_transactions (
  tx_id         NUMBER(10)    CONSTRAINT pk_sd_transactions PRIMARY KEY,
  account_id    NUMBER(10)    NOT NULL
                              CONSTRAINT fk_sd_tx_acc REFERENCES sd_accounts(account_id),
  tx_ref_33     NUMBER(38)    NOT NULL, -- Echte 33-stellige Referenznummer!
  product_code  VARCHAR2(10)  NOT NULL, -- Text wie '03-04' (Excel-Datumsfalle!)
  amount        NUMBER(12,2)  NOT NULL,
  booking_ts    TIMESTAMP     NOT NULL,
  memo_text     VARCHAR2(200)           -- Enthaelt ';', '"', CHR(10) und NULLs
);

-- -----------------------------------------------------------------------------
-- 2. Stammdaten (inkl. Umlauten, fuehrenden Nullen und NULL-Werten)
-- -----------------------------------------------------------------------------
INSERT INTO sd_customers VALUES (101, 'Mueller Maschinenbau GmbH', '01067', 'Dresden',  NULL);
INSERT INTO sd_customers VALUES (102, 'Alpenblick Logistik AG',    '08001', 'Zürich',   'UID-geprueft');
INSERT INTO sd_customers VALUES (103, 'Rheinland Handel KG',       '50667', 'Köln',     NULL);
INSERT INTO sd_customers VALUES (104, 'Bavaria Cloud Services',    '80331', 'München',  'Sonderkondition');
INSERT INTO sd_customers VALUES (105, 'Nordlicht Reederei',        '20095', 'Hamburg',  NULL);

INSERT INTO sd_accounts VALUES (1001, 101, 'DE89370400440532013000', 'EUR', DATE '2022-03-15');
INSERT INTO sd_accounts VALUES (1002, 102, 'CH9300762011623852957',  'CHF', DATE '2023-07-01');
INSERT INTO sd_accounts VALUES (1003, 103, 'DE44500105175407324931', 'EUR', DATE '2024-01-10');
INSERT INTO sd_accounts VALUES (1004, 104, 'DE12500105170648489890', 'EUR', DATE '2025-05-20');
-- Konto 1005 ohne Transaktionen (fuer LEFT JOIN vs. INNER JOIN Test in Modul 4)
INSERT INTO sd_accounts VALUES (1005, 105, 'DE75512108001245126199', 'EUR', DATE '2026-02-01');

-- -----------------------------------------------------------------------------
-- 3. Transaktionen: 33-stellige Zahlen, Datumsfallen, Sonderzeichen + >60 Zeilen
--    (reproduziert auch die 50-Zeilen-Fetch-/Copy-Paste-Falle!)
-- -----------------------------------------------------------------------------
INSERT INTO sd_transactions VALUES (
  1, 1001, 123456789012345678901234567890123, '03-04', 1234.56,
  TIMESTAMP '2026-11-01 08:15:30',
  'Rechnung Nr. 4711; Lieferung "Express"' || CHR(10) || 'Zweite Zeile im Memo'
);

INSERT INTO sd_transactions VALUES (
  2, 1002, 987654321098765432109876543210987, '12-01', -98.50,
  TIMESTAMP '2026-11-02 14:22:05',
  'Storno Pos. 2; Rueckbuchung Zürich'
);

INSERT INTO sd_transactions VALUES (
  3, 1003, 400012345678901234567890123456789, '05-09', 45000.00,
  TIMESTAMP '2026-11-03 17:45:00',
  NULL
);

INSERT INTO sd_transactions VALUES (
  4, 1004, 777000000000000000000000000090123, '01-12', 89.95,
  TIMESTAMP '2026-11-04 09:05:12',
  'Abo-Gebuehr München; inkl. MwSt.'
);

-- 61 weitere Zeilen (gesamt 65 Zeilen > 50-Zeilen-Standardfetch)
INSERT INTO sd_transactions (tx_id, account_id, tx_ref_33, product_code, amount, booking_ts, memo_text)
SELECT 4 + LEVEL,
       1001 + MOD(LEVEL - 1, 4),
       TO_NUMBER('5000000000000000000000000000' || LPAD(TO_CHAR(10000 + LEVEL), 5, '0')),
       CASE MOD(LEVEL, 3) WHEN 0 THEN '03-04' WHEN 1 THEN '07-08' ELSE '11-12' END,
       ROUND(100 + LEVEL * 13.37, 2),
       TIMESTAMP '2026-11-05 08:00:00' + NUMTODSINTERVAL(LEVEL * 37, 'MINUTE'),
       CASE WHEN MOD(LEVEL, 5) = 0 THEN NULL ELSE 'Batch-Buchung #' || LEVEL || '; Test' END
FROM dual
CONNECT BY LEVEL <= 61;

COMMIT;

-- -----------------------------------------------------------------------------
-- 4. Export-View (fuer Quellcode-Suche in Modul 3 und Export-Uebungen in Modul 6)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW sd_v_tx_export AS
SELECT c.customer_id,
       c.customer_name,
       c.postal_code,
       c.city,
       c.tax_note,
       a.account_id,
       a.iban_like,
       a.currency_code,
       t.tx_id,
       t.tx_ref_33,
       t.product_code,
       t.amount,
       t.booking_ts,
       t.memo_text
FROM sd_customers c
JOIN sd_accounts a     ON c.customer_id = a.customer_id
JOIN sd_transactions t ON a.account_id  = t.account_id;

-- Schnellcheck: Erwartet 65 Zeilen und exakt 33 Stellen bei tx_ref_33
SELECT COUNT(*) AS row_cnt,
       MIN(LENGTH(TO_CHAR(tx_ref_33))) AS min_len,
       MAX(LENGTH(TO_CHAR(tx_ref_33))) AS max_len
FROM sd_transactions;
