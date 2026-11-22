# SQL Developer Praxis Checkpoints (`DCP-1` & `DCP-2`)

Zur Standortbestimmung im 30-Lektionen-Praxispfad stehen zwei Checkpoints bereit: **`DCP-1`** nach Modul 3 (Oberfläche/Schachbrett/NLS, Verbindungen & Schemenfilter, Objektsuche) und **`DCP-2`** nach Modul 6 (Drag-and-Drop-Joins, Schnellformatierungen, Excel-Export inkl. 33-stelliger Zahlen).

---

## `DCP-1`: Halbzeit-Check (Module 1–3, `D001`–`D015`)

### Teil A: Verständnis-Check (5 Kurzfragen)
1. Wo aktivierst du im klassischen SQL Developer das **Schachbrett- oder Zebramuster** im Ergebnis-Grid, und warum ist eine `NULL`-Hintergrundfarbe sinnvoll?
2. Warum kopiert `Strg+A` → `Strg+C` im `F9`-Grid bei `sd_transactions` (65 Zeilen) oft nur 50 Zeilen?
3. Welche Passwort-Option wählst du beim JSON-Verbindungs-Export für ein Team-Onboarding-Paket — und warum?
4. Was bedeutet der Hinweis `Tabellen (Filtered)` bzw. `Tabellen (SD_%)` im Navigator, und wie setzt du ihn zurück?
5. Wann nutzt du `Ansicht → Datenbankobjekt suchen` (`Typ: SOURCE`) statt `Shift+F4` auf einem Tabellennamen?

### Teil B: Praxis-Aufgaben
1. **Schema- & Objektfilter:** Filtere `Andere Benutzer` auf `SCOTT` und `HR`, sowie unter deinem Sandbox-Schema `Tabellen` auf `NAME LIKE 'SD_%'`, und prüfe anschliessend per `Shift+F4` die Constraints von `SD_TRANSACTIONS`.
2. **Data-Dictionary-Suche:** Finde per SQL (`USER_TAB_COLUMNS`) alle Tabellen und Views, die die Spalte `TX_REF_33` oder `POSTAL_CODE` enthalten.

??? success "Musterlösungen `DCP-1`"
    **Teil A:**
    1. `Extras → Voreinstellungen → Datenbank → Arbeitsblatt → Raster in Schachbrett- oder Zebramuster` (`Tools → Preferences → Database → Worksheet → Grid in checker board or zebra pattern`). Die `NULL`-Farbe verhindert die Verwechslung von `NULL` mit leeren Strings `''`.
    2. Weil `F9` standardmässig nur den ersten Batch (50 Zeilen) lädt, bis man ganz nach unten scrollt (`Strg+Ende`).
    3. **Passwörter entfernen** (*Remove passwords*): Jedes Teammitglied erhält die Verbindungsdaten, gibt aber sein eigenes persönliches Passwort ein (keine Weitergabe von Credentials).
    4. Es ist ein Filter aktiv; über `Rechtsklick → Filter entfernen` (`Clear Filter`) werden wieder alle Objekte angezeigt.
    5. `Find DB Object (SOURCE)` durchsucht den **Quelltext** von Views/Packages/Prozeduren im gesamten Schema; `Shift+F4` inspiziert gezielt ein einzelnes bekanntes Objekt unter dem Cursor.

    **Teil B:**
    ```sql
    SELECT table_name, column_name, data_type, data_precision
    FROM user_tab_columns
    WHERE column_name IN ('TX_REF_33', 'POSTAL_CODE')
    ORDER BY table_name, column_name;
    ```

---

## `DCP-2`: Abschluss-Check (Module 4–6, `D016`–`D030`)

### Teil A: Verständnis-Check (5 Kurzfragen)
1. Welche Gefahr entsteht im visuellen `Abfrage-Generator` (`Query Builder`), wenn man zwei Tabellen auf die Zeichenfläche zieht und eine Join-Linie fehlt?
2. Mit welchem Shortcut formatierst du eine markierte SQL-Query sofort, und in welchem Dateiformat wird ein Team-Styleguide exportiert?
3. Welchen Hint setzt du direkt nach `SELECT`, um bei `F5` sofort kommagetrenntes CSV bzw. `INSERT`-Statements zu erhalten?
4. Warum wird `123456789012345678901234567890123` (33 Stellen) beim Öffnen in Excel zu `1,23457E+32` und nach Formatwechsel auf „Zahl“ zu `...000000000000000000`?
5. Warum sind sowohl das direkte Öffnen einer `.csv`-Datei per Doppelklick als auch der Trick `="1234..."` in Firmen-Exports problematisch?

### Teil B: Praxis-Aufgaben
1. **Bereinigter 3-Tabellen-Join:** Erzeuge einen Join über `sd_customers`, `sd_accounts` und `sd_transactions` (`LEFT JOIN` auf `sd_transactions`, damit Konto `1005` erhalten bleibt) und formatiere ihn sauber mit `Strg+F7`.
2. **Verlustfreier Excel-Export (33 Stellen):** Schreibe die Export-Query für `sd_transactions`, sodass `tx_ref_33` im `.xlsx`-Export alle 33 Stellen exakt behält, `amount` rechenbar bleibt, `CHR(10)` bereinigt wird — und nenne die 3 Excel-Kontrollformeln für Zelle `B2`.

??? success "Musterlösungen `DCP-2`"
    **Teil A:**
    1. Ein **kartesisches Produkt** (`CROSS JOIN`, z. B. 5 × 65 = 325 statt 65 Zeilen).
    2. `Strg+F7` (`Ctrl+F7`); Team-Formatter-Profile werden als **`.xml`** exportiert.
    3. `SELECT /*csv*/ ...` bzw. `SELECT /*insert*/ ...` in Kombination mit `F5`.
    4. Excel speichert Zahlen nach **IEEE 754 (64-Bit-Float)** mit maximal **15 signifikanten Ziffern**. Alle Ziffern ab Stelle 16 werden beim Einlesen als Zahl unwiderruflich auf `0` gerundet.
    5. CSV-Doppelklick erzwingt Excels Auto-Typisierung (Verlust von 33-Stellen-Zahlen, führenden Nullen wie `01067` und Umwandlung von `'03-04'` in ein Datum); `="1234..."` erzeugt Formeln (CSV-Injection-Warnung, bricht Weiterverarbeitung).

    **Teil B:**
    ```sql
    -- 1. & 2. Verlustfreie Export-Query
    SELECT t.tx_id,
           TO_CHAR(t.tx_ref_33) AS tx_ref_33_txt,
           c.customer_name,
           c.postal_code,
           t.product_code,
           t.amount,
           TO_CHAR(t.booking_ts, 'YYYY-MM-DD HH24:MI:SS') AS booking_ts_iso,
           REPLACE(REPLACE(t.memo_text, CHR(13), ' '), CHR(10), ' ') AS memo_clean
    FROM sd_customers c
    JOIN sd_accounts a     ON c.customer_id = a.customer_id
    LEFT JOIN sd_transactions t ON a.account_id = t.account_id
    ORDER BY t.tx_id;
    ```
    **Excel-Kontrollformeln:** `=LÄNGE(B2)` → `33`, `=ISTTEXT(B2)` → `WAHR`, `=RECHTS(B2;5)` → `"90123"` (bei `tx_id = 1`).
