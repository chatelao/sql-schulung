# Modul 6: Daten nach Excel überführen — insb. 33-stellige Zahlen ohne E-Form (`D026`–`D030`)

**Voraussetzung**: Module 1–5 (`D001`–`D025`)  
**Sandbox-Tabellen**: `sd_customers`, `sd_accounts`, `sd_transactions`, `sd_v_tx_export` aus [sqldeveloper-sandbox.sql](labs/sqldeveloper-sandbox.sql)

---

## 1. Warum Excel 33-stellige Zahlen zerstört (IEEE-754-Grenze) (`D026`)

Oracle speichert `NUMBER(38)` mit bis zu **38 exakten Dezimalziffern** — z. B. eine 33-stellige Transaktionsreferenz `123456789012345678901234567890123`.  
Microsoft Excel speichert Zahlen intern als **64-Bit-Gleitkommazahl nach IEEE 754**. Dieses Format kennt **maximal 15 signifikante Ziffern**!

| Schritt | Was passiert mit `123456789012345678901234567890123` (33 Stellen)? | Schaden |
| :--- | :--- | :--- |
| **1. Oracle `NUMBER(38)`** | Exakt `123456789012345678901234567890123` | Kein Verlust |
| **2. Script Output (`F5`) ohne `SET NUMWIDTH`** | Kürzt auf `1,2346E+32` (Abhilfe in SQL Developer: `SET NUMWIDTH 38`) | Nur Anzeige in `F5` |
| **3. Naiver `.xlsx`-Export / CSV-Doppelklick** | Excel liest den Wert als Zahl: zeigt `1,23457E+32` (ab 12 Stellen `E`-Form!) | Darstellung unlesbar |
| **4. Umformatieren auf „Zahl“ in Excel** | `123456789012345000000000000000000` | **Die letzten 18 Stellen wurden unwiderruflich durch `0` ersetzt!** |

```mermaid
flowchart TD
    O["Oracle NUMBER(38): 123456789012345678901234567890123"] --> Bad["Naiver Export ohne TO_CHAR / CSV-Doppelklick"]
    O --> Good1["Goldstandard 1: TO_CHAR(tx_ref_33) + .xlsx-Export"]
    O --> Good2["Goldstandard 2: CSV (UTF-8) + Power Query (Typ: Text)"]
    Bad --> Fail["Excel IEEE-754 (15 Stellen): 1,23457E+32 -> 18 Nullen am Ende!"]
    Good1 --> Ok["Echte Excel-Textzelle: alle 33 Ziffern exakt, keine E-Form"]
    Good2 --> Ok
```
*Alt-Text: Datenverlust-Pfad beim naiven Excel-Export durch die 15-stellige IEEE-754-Grenze versus die beiden verlustfreien Goldstandards TO_CHAR nach xlsx und CSV mit Power Query.*

---

## 2. Goldstandard 1: Direkter `.xlsx`-Export mit `TO_CHAR(...)` (`D027`)

Auch beim direkten Export als **`excel 2003+ (xlsx)`** aus dem SQL-Developer-Grid schreibt SQL Developer eine `NUMBER`-Spalte als **numerische Excel-Zelle** — und Excel rundet die 33 Stellen sofort beim Öffnen auf 15 Stellen ab!

**Die sichere Lösung direkt im SQL:** Wandle jede 33-stellige ID (und jede Nummer mit führenden Nullen) **vor dem Export** explizit per `TO_CHAR(...)` in `VARCHAR2` um:

```sql
SELECT t.tx_id,
       TO_CHAR(t.tx_ref_33) AS tx_ref_33_txt,                 -- -> Echte Textzelle in .xlsx!
       c.postal_code,                                         -- VARCHAR2 ('01067' bleibt erhalten)
       t.product_code,                                        -- VARCHAR2 ('03-04' wird NICHT zu 03. Apr!)
       t.amount,                                              -- Echtes NUMBER -> rechnet in Excel!
       TO_CHAR(t.booking_ts, 'YYYY-MM-DD HH24:MI:SS') AS ts_iso,
       REPLACE(REPLACE(t.memo_text, CHR(13), ' '), CHR(10), ' ') AS memo_clean
FROM sd_customers c
JOIN sd_accounts a     ON c.customer_id = a.customer_id
JOIN sd_transactions t ON a.account_id  = t.account_id
ORDER BY t.tx_id;
```

**Klickpfad in SQL Developer:**
1. Abfrage mit **`F9`** ausführen.
2. **Rechtsklick ins Ergebnis-Grid → `Exportieren...`** (`Export...`).
3. Format: **`excel 2003+ (xlsx)`**, Encoding: `UTF-8`.
4. Empfohlen: Haken bei **„SQL-Abfrage in Arbeitsblatt exportieren“** setzen (erstellt ein zweites Excel-Tab mit der exakten Query als Audit-Trail!).

---

## 3. Goldstandard 2: `CSV (UTF-8)` + Excel Power Query (`D028`)

```mermaid
flowchart LR
    SD["SQL Developer: Export CSV (UTF-8)"] --> Rule["NIEMALS per Doppelklick oeffnen!"]
    Rule --> PQ["Excel: Daten -> Aus Text/CSV (65001: UTF-8)"]
    PQ --> Trans["Daten transformieren (Power Query Editor)"]
    Trans --> Fix["Schritt 'Geaenderter Typ' pruefen -> tx_ref_33 auf TEXT setzen"]
    Fix --> Load["Schliessen & laden -> 33 Stellen exakt!"]
```
*Alt-Text: Sicherer CSV-Import in Excel über Power Query: Export als UTF-8, Import über Daten Aus Text/CSV, explizites Umstellen des Spaltentyps auf Text vor dem Laden.*

!!! warning "Anti-Patterns unbedingt vermeiden"
    - **CSV per Doppelklick öffnen:** Excel rät Typen automatisch, schneidet `01067` auf `1067` ab, macht `'03-04'` zu `03. Apr` und zerstört 33-stellige Zahlen!
    - **Trick `="1234567890..."` im CSV:** Erzeugt Excel-Formeln (CSV-Injection-Risiko / Sicherheitswarnungen, erschwert SVERWEIS/XVERWEIS und Filter).
    - **Trick `'1234567890...` mit Hochkomma im CSV:** In CSV wird das führende `'` als sichtbares Zeichen Teil des Werts (`34` Zeichen statt `33`).
    - **Excel-365-Option „Automatische Datenkonvertierung“:** Hilft nur lokal auf deinem eigenen PC, nicht wenn du die CSV-Datei an Kolleg:innen weitergibst.

---

## 4. Schnelles Copy-Paste (`Strg+Umschalt+C` / `Ctrl+Shift+C`) & Excel-Spalten als „Text“ vorbereiten (`D029`)

Für kleine Ad-hoc-Abfragen (wenige Zeilen) greift man im Alltag oft zu Copy-Paste aus dem Ergebnis-Grid statt zum Export-Assistenten. Damit dabei weder Spaltenköpfe noch 33-stellige Zahlen verloren gehen, sind **zwei Schritte zwingend**:

### Schritt 1: Richtig kopieren im SQL-Developer-Grid

| Shortcut / Aktion | Was wird kopiert? | Wichtiger Hinweis |
| :--- | :--- | :--- |
| **`Strg+C`** (`Ctrl+C`) | Nur die markierten **Datenwerte** (ohne Spaltennamen) | Für einzelne Werte oder Einfügen in bestehende Listen |
| **`Strg+Umschalt+C`** (`Ctrl+Shift+C`) | Markierte Zeilen **inklusive Spaltenüberschriften** (*Copy with Headers*) | **Standard für Excel-Übernahmen** — behält die Kopfzeile |
| **`Strg+Ende` → `Strg+A` → `Strg+Umschalt+C`** | Alle Zeilen der Abfrage **inklusive Spaltenüberschriften** | Ohne `Strg+Ende` (ganz nach unten scrollen) kopiert `F9` **nur die ersten 50 Zeilen**! |

### Schritt 2: Zielspalten in Excel **vor dem Einfügen** als „Text“ vorbereiten

Wenn du 33-stellige Zahlen, Postleitzahlen (`01067`) oder Codes (`03-04`) direkt in ein leeres Excel-Blatt (`Standard`) einfügst, wandelt Excel sie **sofort beim Einfügen** in `1,23457E+32` um — ein nachträgliches Umstellen auf `Text` repariert die verlorenen Stellen **nicht**!

1. **In Excel *vor* dem Einfügen** die Zielspalten (z. B. Spalte `B` für `TX_REF_33`, Spalte `C` für `POSTAL_CODE`, Spalte `D` für `PRODUCT_CODE`) komplett markieren.
2. **`Start → Zahl → Text`** (oder `Strg+1` → Kategorie **`Text`**) auswählen — die Zellen sind nun **vorbereitet**, noch bevor Daten hineinkommen.
3. **Einfügen über `Inhalte einfügen` (wichtig!):**
   - Wähle in Excel **`Start → Einfügen → Inhalte einfügen... → Text`** (bzw. *An Zielformatierung anpassen* / unformatierter Text) statt blindem `Strg+V` — so übernimmt Excel die vorbereitete `Text`-Formatierung der Zielspalte, statt eigene HTML-/Zwischenablage-Typen anzuwenden.
4. **Sofortige Kontrolle:** In der Formelzeile stehen alle **33 Ziffern ohne `E+32`**, Excel zeigt ggf. das kleine grüne Dreieck (*„Als Text gespeicherte Zahl“* — hier ausdrücklich **erwünscht**, *nicht* in Zahl konvertieren!), und `=LÄNGE(B2)` liefert `33`.

!!! warning "Wann Copy-Paste trotzdem tabu ist"
    Sobald Zeilenumbrüche (`CHR(10)`) oder Tabulatoren im Text vorkommen, viele Zeilen (> 500) benötigt werden oder das Ergebnis reproduzierbar im Team geteilt wird, immer **Goldstandard 1 (`.xlsx` + `TO_CHAR`)** oder **Goldstandard 2 (`CSV` + Power Query)** nutzen.

---

## 5. Entscheidungsmatrix für alle Datentypen & Zeilenzahlen (`D029`)

| Datentyp / Sonderfall | Problem bei naivem Export | Empfohlene Lösung |
| :--- | :--- | :--- |
| **33-stellige ID (`NUMBER(38)`)** | `E+32` + Rundung nach 15 Stellen | `TO_CHAR(...)` + `.xlsx` **oder** `CSV` + Power Query (`Text`) **oder** Zielspalte vorab als `Text` + `Strg+Umschalt+C` |
| **Führende Nullen (`'01067'`)** | Wird in CSV/Standard zu `1067` | `VARCHAR2` / `LPAD(..., '0')` + `.xlsx` **oder** Power Query (`Text`) **oder** Excel-Spalte vorab `Text` |
| **Code wie `'03-04'`** | Excel macht `03. Apr` daraus | `VARCHAR2` + `.xlsx` **oder** Power Query (`Text`) **oder** Excel-Spalte vorab `Text` |
| **Beträge (`1234.56`)** | Punkt- vs. Komma-Dezimaltrennzeichen | Als echtes `NUMBER` in `.xlsx` (kulturunabhängig!) oder Power Query *„Mit Gebietsschema verwenden → Englisch (USA)“* |
| **Umlaute (`München`, `Zürich`)** | `MÃ¼nchen` bei ANSI/Win-1252 | Immer `UTF-8` beim Export und `65001: Unicode (UTF-8)` in Power Query |
| **Zeilenumbrüche (`CHR(10)`)** | Zerreisst Zeilen in naiven CSV-/Clipboard-Parsern | `REPLACE(col, CHR(10), ' ')` oder `.xlsx` / sauberes CSV-Quoting (`"`) |
| **> 50 Zeilen** | `Strg+A`/`Strg+Umschalt+C` ohne Scrollen kopiert nur 50 Zeilen | Vorher `Strg+Ende` drücken oder `Rechtsklick → Exportieren...` nutzen |
| **> 1.048.576 Zeilen** | Excel-Blattlimit überschritten | `CSV` (`/*csv*/` + `SPOOL`) → in Excel *„Nur Verbindung erstellen / Datenmodell (Power Pivot)“* |

!!! tip "Rückweg Excel → Oracle"
    Über `Rechtsklick auf Tabellen → Daten importieren...` (`Import Data...`) liest SQL Developer `.xlsx`/`.csv` wieder in Oracle ein. Wähle für 33-stellige Referenznummern dort bewusst `VARCHAR2(33)` (wenn nicht gerechnet wird) oder `NUMBER(38)`.

---

## Lektionen im Detail

### `D026` — Die Excel-Zahlenfalle: IEEE-754 (15 Stellen) vs. Oracle `NUMBER(38)` & `SET NUMWIDTH`
- **Lernziel:** Du erklärst die technische Ursache (IEEE-754 15 Stellen), reproduzierst die `E`-Notation in `F5` und behebst die `F5`-Anzeige mit `SET NUMWIDTH 38` *(Bloom: Analysieren)*
- **Menüpfad / Shortcut (DE / EN):** `F5` (Skriptausgabe) mit `SET NUMWIDTH 38` vs. Excel-Zellformat `Standard`
- **Selbstlern-Aufgabe (Lückentext/Check):** `Ab wie vielen signifikanten Stellen verliert Excel durch IEEE-754 bei normalen Zahlen unumkehrbar Genauigkeit (12, ___ oder 33)?`
  ??? success "Musterlösung & Erklärung"
      Ab **15** signifikanten Stellen (ab 12 Stellen schaltet die Anzeige auf `E+...`, ab der **16. Stelle** werden alle weiteren Ziffern auf `0` gerundet). In SQL Developer `F5` verhindert `SET NUMWIDTH 38` die `E`-Anzeige in der Skriptausgabe.

### `D027` — Goldstandard 1: Direkter `.xlsx`-Export mit `TO_CHAR(...)`
- **Lernziel:** Du wandelst lange Zahlen in SQL gezielt mit `TO_CHAR(...)` um und exportierst aus dem Grid als `.xlsx` inklusive Audit-SQL-Tab *(Bloom: Anwenden)*
- **Menüpfad / Shortcut (DE / EN):** `F9` → Rechtsklick im Grid → `Exportieren...` / `Export...` → `excel 2003+ (xlsx)`
- **Selbstlern-Aufgabe (Lückentext/Check):** `Ergänze die Export-Query so, dass tx_ref_33 als echte Textzelle in .xlsx landet: SELECT tx_id, ___(tx_ref_33) AS tx_ref_33_txt FROM sd_transactions;`
  ??? success "Musterlösung & Erklärung"
      `TO_CHAR(tx_ref_33)` — dadurch liefert Oracle den Spaltentyp `VARCHAR2`, und SQL Developer schreibt im `.xlsx` eine String-Zelle statt einer numerischen Zelle.

### `D028` — Goldstandard 2: `CSV (UTF-8)` + Excel Power Query (`Aus Text/CSV`)
- **Lernziel:** Du importierst UTF-8-CSVs verlustfrei über Excel Power Query (`Aus Text/CSV`) und setzt den Spaltentyp explizit auf `Text`, statt die Datei per Doppelklick zu öffnen *(Bloom: Anwenden)*
- **Menüpfad / Shortcut (DE / EN):** `Exportieren... → csv (UTF-8)` → in Excel: `Daten → Daten abrufen → Aus Datei → Aus Text/CSV` → `Daten transformieren`
- **Selbstlern-Aufgabe (Lückentext/Check):** `Warum ist die Formel-Schreibweise ="1234567890..." im CSV-Export trotz korrekter Anzeige ein Anti-Pattern?`
  ??? success "Musterlösung & Erklärung"
      Sie erzeugt eine Excel-Formel statt eines reinen Datenwerts, löst in sicheren Umgebungen CSV-Injection-Warnungen aus und stört automatische Weiterverarbeitungen (Power Query, SVERWEIS, Datenbank-Reimport).

### `D029` — Copy-Paste (`Ctrl+Shift+C`), Excel-Text-Vorbereitung & alle Datentypen sicher überführen
- **Lernziel:** Du nutzt `Strg+Umschalt+C` (*Copy with Headers*) in Kombination mit vorab als `Text` formatierten Excel-Zielspalten (`Inhalte einfügen → Text`) und wählst für jeden Datentyp und jede Datenmenge das passende Verfahren *(Bloom: Bewerten)*
- **Menüpfad / Shortcut (DE / EN):** `Strg+Ende` → `Strg+A` → `Strg+Umschalt+C` (`Ctrl+Shift+C`) → in Excel: Zielspalte `Strg+1` (`Text`) → `Inhalte einfügen → Text`; bzw. `Exportieren...` (`xlsx`/`csv`) und `Daten importieren...`
- **Selbstlern-Aufgabe (Lückentext/Check):** `Du möchtest 4 Zeilen aus dem Grid per Tastenkürzel INKLUSIVE Spaltenüberschriften kopieren und in Excel verlustfrei einfügen: Im Grid drückst du ___, und in Excel formatierst du die Zielspalte VOR dem Einfügen auf ___.`
  ??? success "Musterlösung & Erklärung"
      Im Grid **`Strg+Umschalt+C`** (`Ctrl+Shift+C`), in Excel vorab **`Text`** (über `Start → Zahl → Text` bzw. `Strg+1 → Text`, anschliessend über `Inhalte einfügen → Text` einfügen). Nachträgliches Umstellen auf `Text` kann bereits gerundete Ziffern nicht wiederherstellen.

### `D030` — Modul-6-Lab & Capstone: End-to-End-Finanzexport mit Excel-Integritätsprüfung
- **Lernziel:** Du führst den kompletten Export über `sd_customers`, `sd_accounts` und `sd_transactions` durch und verifizierst die Datenintegrität direkt in Excel per Kontrollformeln *(Bloom: Bewerten)*
- **Menüpfad / Shortcut (DE / EN):** `F9` → `Exportieren... (xlsx)` → Prüfung in Excel
- **Selbstlern-Aufgabe (Lückentext/Check):** `Welche drei Excel-Prüfformeln beweisen nach dem Öffnen der Exportdatei, dass tx_ref_33_txt in Zelle B2 exakt und ungerundet angekommen ist?`
  ??? success "Musterlösung & Erklärung"
      1. `=LÄNGE(B2)` → **`33`** (keine Kürzung)  
      2. `=ISTTEXT(B2)` → **`WAHR`** (keine IEEE-754-Zahl)  
      3. `=RECHTS(B2;5)` → **`"90123"`** für `tx_id = 1` (Endziffern nicht auf `"00000"` gerundet!)

---

## Selbstlern-Aufgaben (Modul 6)

1. **(★)** Führe `SELECT tx_id, tx_ref_33 FROM sd_transactions WHERE tx_id <= 4;` einmal ohne und einmal mit `SET NUMWIDTH 38` über `F5` aus und vergleiche die Skriptausgabe.
2. **(★★)** Markiere dieselben 4 Zeilen im `F9`-Grid und kopiere sie mit **`Strg+Umschalt+C`** (`Ctrl+Shift+C`). Formatiere in einem neuen Excel-Blatt Spalte `B` **vorab** als `Text`, füge über `Inhalte einfügen → Text` ein und prüfe `=LÄNGE(B2)=33` sowie `=ISTTEXT(B2)=WAHR`.
3. **(★★★)** Exportiere alle 65 Zeilen mit der Goldstandard-Query aus [sqldeveloper-solutions.sql](labs/sqldeveloper-solutions.sql) als `.xlsx` (inkl. SQL-Arbeitsblatt) sowie als `CSV (UTF-8)` über `Excel → Daten → Aus Text/CSV → Daten transformieren` (`tx_ref_33_txt`, `postal_code`, `product_code` als `Text`; `amount` über Gebietsschema `Englisch (USA)` als `Dezimalzahl`).

??? success "Musterlösungen zu Modul 6"
    Siehe [sqldeveloper-solutions.sql](labs/sqldeveloper-solutions.sql) (Modul 6). Sowohl bei Copy-Paste (`Strg+Umschalt+C` + vorab als `Text` formatierte Excel-Spalte + `Inhalte einfügen → Text`) als auch bei `.xlsx` / Power Query liefert `=RECHTS(B2;5)` für `tx_id = 1` exakt `"90123"`, `postal_code` bleibt `"01067"` (Länge 5), `product_code` bleibt `"03-04"` und `=SUMME(...)` über alle 65 `amount`-Werte rechnet ohne `#WERT!`-Fehler.

---

## Hybrid-Paaraufgabe (3+3) & Praxis-Transfer

- **Hybrid-Paaraufgabe (Driver/Navigator, 10 Min.):** Person A exportiert `sd_v_tx_export` bewusst **ohne** `TO_CHAR(tx_ref_33)` nach `.xlsx` und zeigt in Excel den Schaden (`1,23457E+32` + Nullen). Person B übernimmt als Driver, korrigiert die Query mit `TO_CHAR`, exportiert neu und führt den 3-Formel-Check (`=LÄNGE`, `=ISTTEXT`, `=RECHTS`) im Screen-Share vor.
- **Praxis-Transfer:** Prüfe bei deiner nächsten Excel-Auswertung aus dem Firmensystem jede ID-, Beleg-, Referenz- oder PLZ-Spalte mit > 11 Ziffern oder führenden Nullen und speichere dir die `TO_CHAR`-Exportvorlage als Code-Template ab.

## Oracle-Referenz

- [Oracle SQL Developer User's Guide — Exporting and Importing Data](https://docs.oracle.com/en/database/oracle/sql-developer/24.3/rptug/sql-developer-concepts-usage.html)
- [Oracle Database 26ai SQL Language Reference — TO_CHAR (number)](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/TO_CHAR-number.html)
- [Oracle Database 26ai SQL*Plus User's Guide — SET NUMWIDTH](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqpug/SET-system-variable-summary.html)
