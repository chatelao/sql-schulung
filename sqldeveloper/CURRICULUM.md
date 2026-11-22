# Curriculum: Oracle SQL Developer Praxis (`D001`–`D030`)

Dieser Lehrplan ergänzt das [`1Z0-171`-Grundlagen-Curriculum](../1Z0-171/CURRICULUM.md) und das [`advanced/`-Curriculum](../advanced/CURRICULUM.md) **ausserhalb der Zertifizierungsziele** um **30 praxisorientierte Lektionen à 45 Minuten (22,5 Zeitstunden)** in 6 Modulen. Der Fokus liegt auf der produktiven täglichen Arbeit mit **Oracle SQL Developer**: Oberfläche & Schachbrett-Grid, Verbindungsverwaltung & Schemenfilter, Objektsuche, Drag-and-Drop-Joins, Schnellformatierungen sowie verlustfreier Datenexport nach Excel (insbesondere **33-stellige Zahlen ohne wissenschaftliche `E`-Notation**).

---

## Didaktisches Prinzip & Voraussetzungen

- **Zielgruppe**: Einsteiger:innen (parallel ab `1Z0-171` Phase 1–5), Firmen-Anwender:innen (Route A) und SQL-Praktiker:innen, die Oracle SQL Developer im Arbeitsalltag sicher beherrschen wollen.
- **45-Minuten-Struktur**: 10 Min. UI-Konzept & Hintergrund → 15 Min. geführtes Live-Demo (DE/EN-Menüpfad) an der [SQL Developer Sandbox](docs/labs/sqldeveloper-sandbox.sql) → 15 Min. eigenständige Praxisübung → 5 Min. Stolperfallen- & Zielsystem-Check (z. B. Kontrolle in Excel).
- **Zweisprachige Menüpfade**: Alle Menüs und Optionen werden **Deutsch / Englisch** angegeben (z. B. `Extras → Voreinstellungen` / `Tools → Preferences`), da in Firmen oft beide UI-Sprachen im Einsatz sind.

---

## Modul-Übersicht

| Modul | Lektionen | Thema | Schwerpunkt |
| :---: | :---: | :--- | :--- |
| **Modul 1** | `D001`–`D005` | **Oberfläche, Schachbrettmuster, Grid & NLS** | Classic vs. VS Code Extension, Schachbrett-/Zebramuster, NULL-Farben, NLS-Datum, `F9` vs. `F5` |
| **Modul 2** | `D006`–`D010` | **Verbindungen, Import/Export & Schemenfilter** | Ordner & Farbcodes, JSON-Export/-Import (Passwort-Sicherheit), `tnsnames.ora`, Schemen- & Objektfilter |
| **Modul 3** | `D011`–`D015` | **Objekte suchen & inspizieren** | `Find DB Object`, Spalten-/Quelltextsuche, `Shift+F4`, `Modell`-ERD, Reports & `ALL_*`-Views |
| **Modul 4** | `D016`–`D020` | **Drag-and-Drop-Joins & Query Builder** | Navigator-Drag-and-Drop, `Abfrage-Generator`, `INNER`/`OUTER`, Risiken (Kartesisches Produkt) |
| **Modul 5** | `D021`–`D025` | **Schnellformatierungen & Produktivität** | `Strg+F7`, `Alt+'`, `Strg+/`, Team-XML-Styleguide, Templates (`ssf`), `F8`, Output-Hints (`/*csv*/`) |
| **Modul 6** | `D026`–`D030` | **Daten & 33-stellige Zahlen nach Excel** | IEEE-754-Grenze (15 Stellen), `SET NUMWIDTH 38`, `.xlsx` + `TO_CHAR`, `CSV` + Power Query, Kontrollformeln |

---

## Modul 1: Oberfläche, Schachbrettmuster, Grid & NLS (`D001`–`D005`)

Ein sauber konfiguriertes Worksheet verhindert Ablesefehler, macht `NULL`-Werte sofort sichtbar und sorgt für reproduzierbare Datums- und Zahlenformate — besonders auch beim Screen-Sharing in hybriden Teams.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D001` | **SQL Developer im Überblick: Classic Desktop vs. VS Code Extension vs. Web** | Architektur & Einsatzgebiete der drei Clients; wann der klassische Desktop-Client Vorteile bietet (Query Builder, Reports, `.xlsx`-Export) und wo VS Code Extension / Database Actions glänzen |
| `D002` | **Schachbrett- & Zebramuster, NULL-Markierung & Lesbarkeit im Grid** | `Raster in Schachbrett- oder Zebramuster` (`Grid in checker board or zebra pattern`), `Display Null Value As` + Hintergrundfarbe, Zeilennummern im Editor, Schriftgrösse (≥ 16 pt für Beamer/Teams) |
| `D003` | **NLS-Einstellungen: ISO-Datum, Dezimaltrennzeichen & Session-Sprache** | `Datenbank → NLS`: `YYYY-MM-DD HH24:MI:SS` gegen abgeschnittene Uhrzeiten, Dezimal-/Gruppentrennzeichen (`.` vs. `,`) als Vorbereitung auf saubere Exporte |
| `D004` | **Fetch-Size (`F9` vs. `F5`), Ergebnisse anpinnen & Single Record View** | Unterschied `Anweisung ausführen` (`F9`, Grid, 50-Zeilen-Fetch) vs. `Skript ausführen` (`F5`, Script Output), Ergebnis-Reiter anpinnen (`Pin`), `Einzeldatensatz-Ansicht` (`Single Record View`) |
| `D005` | **Modul-1-Lab: Arbeitsplatz produktiv & präsentationstauglich einrichten** | Komplette Erstkonfiguration prüfen: Schachbrettmuster, `(null)`-Farbe, ISO-NLS, 50-Zeilen-Fetch auf `sd_transactions` testen |

---

## Modul 2: Verbindungen, Import/Export & Schemenfilter (`D006`–`D010`)

In Unternehmen mit vielen Schemas (DEV, TEST, PROD) und hunderten Tabellen sorgen Verbindungs-Ordner, sichere Export-Pakete und gezielte Schemenfilter für Übersicht und Schutz vor versehentlichen PROD-Änderungen.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D006` | **Verbindungen anlegen, in Ordnern strukturieren & farbcodieren** | Verbindungs-Ordner (`Zur Gruppe hinzufügen`), Farbcodierung für Rahmen/Statusleiste (Grün = DEV, Gelb = TEST, Rot = PROD), Basic vs. TNS vs. Cloud Wallet |
| `D007` | **Verbindungen exportieren & importieren (JSON, Passwort-Sicherheit & Konflikte)** | Rechtsklick `Verbindungen → Verbindungen exportieren...` (`.json`), drei Passwort-Modi (*Entfernen* für Teams/Git, *Mit Schlüssel verschlüsseln* für Backups, *Klartext-Verbot*), Duplikat-Handling beim Import |
| `D008` | **Zentrale Verbindungsverwaltung mit `tnsnames.ora` & Fehlerdiagnose** | `Datenbank → Erweitert → Tnsnames-Verzeichnis`, Nutzen zentraler Netzlaufwerk-Dateien, typische Verbindungsfehler (`ORA-12154`, `ORA-12514`, `ORA-01017`) |
| `D009` | **Schemenfilter (`Andere Benutzer`) & Objektfilter anwenden/zurücksetzen** | `Andere Benutzer` (`Other Users`) → `Filter anwenden...` (`Apply Filter...`) in grossen DBs, Tabellen-/View-Filter (`LIKE`, `Ignore Case`, `Include Synonyms`, `Override Schema Filter`), `(Filtered)`-Falle & `Filter entfernen` |
| `D010` | **Modul-2-Lab: Team-Verbindungspaket & Schema-Filter-Workflow** | Verbindungsgruppe anlegen, sicher ohne Passwörter als JSON exportieren, Schema- und Objektfilter (`SD_%`) kombinieren und wieder zurücksetzen |

---

## Modul 3: Objekte suchen, inspizieren & Metadaten verstehen (`D011`–`D015`)

Statt sich endlos durch Objektbäume zu klicken, finden Profis Tabellen, Spaltennamen, Foreign Keys und View-/PL/SQL-Quellcode in Sekunden.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D011` | **Datenbankobjekte suchen (`Ansicht → Datenbankobjekt suchen`)** | Fernglas-Icon / `Find DB Object`, Auswahl von Verbindung, Schema-Umfang (`Alle Schemas` vs. aktuelles Schema) und Objekttypen (`TABLE`, `VIEW`, `INDEX`, `CONSTRAINT`) mit `%`-Wildcards |
| `D012` | **Spalten- & Quelltextsuche (`COLUMN`, `SOURCE`) vs. Data Dictionary (`ALL_*`)** | Suche nach Spaltennamen (`TX_REF_33`) oder Textfragmenten in Views/Packages (`SOURCE`), Vergleich mit `ALL_TAB_COLUMNS` und `ALL_SOURCE` für automatisierbare Analysen |
| `D013` | **Schnelle Objekt-Inspektion: `Shift+F4`, `Ctrl+Click` & `Dependencies`** | `Shift+F4` (Popup Describe) direkt auf Tabellennamen im Editor, `Ctrl+Click` Navigation, Reiter `Spalten`, `Daten`, `Constraints`, `Abhängigkeiten` (`Dependencies`) und `SQL` (DDL) |
| `D014` | **Datenmodell im Reiter `Modell` (ERD) & eingebaute Berichte (`Reports`)** | Visuelles FK-Diagramm einer Tabelle über den Reiter `Modell`, `Ansicht → Berichte` (z. B. *Tabellen ohne Primärschlüssel*, *Ungültige Objekte*, eigene SQL-Berichte) |
| `D015` | **Modul-3-Lab: Unbekanntes Fachschema in 10 Minuten kartieren** | Alle `SD_%`-Objekte finden, Spalte `POSTAL_CODE` über Tabellen/Views verfolgen, FK-Beziehungen über `Shift+F4` & `Modell` erfassen |

---

## Modul 4: Drag-and-Drop-Joins & visueller Query Builder (`D016`–`D020`)

Drag-and-Drop und der grafische Query Builder beschleunigen die Exploration komplexer Schemas — erfordern aber anschliessendes SQL-Review, um kartesische Produkte und unleserlichen Code zu vermeiden.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D016` | **Drag & Drop aus dem Navigator konfigurieren & nutzen** | `Voreinstellungen → Datenbank → Drag-and-Drop`, Einzel- vs. Mehrfachauswahl (`Ctrl+Click`) auf `sd_customers`, `sd_accounts`, `sd_transactions` ins Worksheet → automatischer FK-Join |
| `D017` | **Visueller Query Builder (`Abfrage-Generator`): Tabellen & Join-Linien** | Wechsel vom Reiter `Arbeitsblatt` auf `Abfrage-Generator`, Tabellen per Drag & Drop platzieren, automatische FK-Linien prüfen, fehlende FKs manuell per Spalten-Drag verknüpfen |
| `D018` | **Join-Typen (`INNER`/`OUTER`), Filter & ANSI-vs.-`(+)`-Ausgabe** | Rechtsklick auf Join-Linie für `LEFT`/`RIGHT`/`FULL OUTER JOIN`, Spaltenauswahl, `WHERE`-Kriterien, Sortierung und Umschaltung zwischen ANSI-Join und Legacy-`(+)`-Syntax |
| `D019` | **Grenzen & Gefahren von Drag-and-Drop-Joins** | Vergessene Join-Linie (= kartesisches Produkt!), unsprechende Auto-Aliase (`A1`, `A2`), unnötiges `SELECT *`, fehlende Subquery-/CTE-Fähigkeiten; Hinweis zur VS Code Extension |
| `D020` | **Modul-4-Lab: Vom Drag-and-Drop-Entwurf zur sauberen Produktions-Query** | 3-Tabellen-Entwurf im Query Builder erzeugen, auf `LEFT JOIN` umstellen, ins Worksheet übernehmen, Aliase auf `c`/`a`/`t` bereinigen und Zeilenanzahl verifizieren |

---

## Modul 5: Schnellformatierungen, Shortcuts & Output-Hints (`D021`–`D025`)

Einheitlich formatiertes SQL lässt sich im Team schneller lesen, reviewen und debuggen — und mit Output-Hints liefert `F5` auf Wunsch sofort CSV, JSON oder `INSERT`-Skripte.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D021` | **Schnellformatierung (`Strg+F7`), Case-Toggle (`Alt+'`) & Blockkommentare (`Strg+/`)** | Gesamtes Skript oder markierten Block per `Strg+F7` formatieren, Gross-/Kleinschreibung mit `Alt+'` umschalten, Zeilen mit `Strg+/` kommentieren |
| `D022` | **Eigene Formatter-Regeln (`Format → Advanced`) & Team-Styleguide als XML** | `Code-Editor → Format → Erweiterte Formatierung`: Keywords `UPPER`, Identifier `lower`, Zeilenumbrüche & Komma-Position definieren; Profil als `.xml` exportieren und im Team teilen |
| `D023` | **Code-Templates (`ssf`, `ct`), Completion Insight (`Strg+Leertaste`) & SQL History (`F8`)** | Eigene Abkürzungen unter `SQL-Editor-Codevorlagen` anlegen, automatische Spaltenvorschläge nutzen, alte Statements in `F8` (SQL-Historie) wiederfinden |
| `D024` | **Output-Formatierungs-Hints bei `F5` (`/*csv*/`, `/*insert*/`, `/*json*/`, `/*ansiconsole*/`)** | Eingebaute SQLcl-/SQL-Developer-Hints im `SELECT` direkt bei `F5` nutzen und mit `SPOOL` kombinieren |
| `D025` | **Modul-5-Lab: Chaotische Legacy-Query in 2 Minuten standardisieren** | Unformatierte 3-Tabellen-Query per `Strg+F7` & Formatter-Regel bereinigen und wahlweise als `/*csv*/` sowie `/*json*/` ausgeben |

---

## Modul 6: Daten nach Excel überführen — insb. 33-stellige Zahlen ohne E-Form (`D026`–`D030`)

Der Klassiker im Büroalltag: Eine 33-stellige Referenznummer oder IBAN-ähnliche ID wird in Excel zu `1,23457E+32` verstümmelt — und die letzten 18 Stellen werden beim Speichern **unwiderruflich zu Nullen gerundet**. Dieses Modul zeigt die exakte Ursache und zwei verlustfreie Goldstandards.

| Lektion | Titel | Zentrale Inhalte & Werkzeuge |
| :--- | :--- | :--- |
| `D026` | **Die Excel-Zahlenfalle: IEEE-754 (15 Stellen) vs. Oracle `NUMBER(38)` & `SET NUMWIDTH`** | Warum Excel nur **15 signifikante Ziffern** speichert (ab 12 Stellen `E`-Notation, ab Stelle 16 Rundung auf `0`), Vorstufe `SET NUMWIDTH 38` bei `F5` in SQL Developer |
| `D027` | **Goldstandard 1: Direkter `.xlsx`-Export mit `TO_CHAR(...)`** | Warum `.xlsx` ohne `TO_CHAR` die 33-stellige Zahl trotzdem zerstört; Lösung `TO_CHAR(tx_ref_33)` (`VARCHAR2` → echte Excel-Textzelle!), Export-Wizard mit „SQL-Abfrage in Arbeitsblatt exportieren“ |
| `D028` | **Goldstandard 2: `CSV (UTF-8)` + Excel Power Query (`Aus Text/CSV`)** | Niemals CSV per Doppelklick öffnen! Stattdessen `Daten → Aus Text/CSV` (`UTF-8 65001`) → `Daten transformieren` → Typ auf **Text** setzen; Anti-Patterns (`'1234`, `="1234"`, Excel-365-Option) |
| `D029` | **Alle Datentypen sicher exportieren & Rückweg Excel → Oracle** | Führende Nullen (`01067`), Datumsfalle `'03-04'`, Dezimal `.`/`,`, UTF-8-Umlaute, `CHR(10)`-Zeilenumbrüche, 50-Zeilen-Copy-Paste-Falle, 1.048.576-Zeilen-Limit & Import-Assistent |
| `D030` | **Modul-6-Lab & Capstone: End-to-End-Finanzexport mit Excel-Integritätsprüfung** | Vollständiger Export aus `sd_v_tx_export` nach `.xlsx` und Verifikation in Excel mit `=LÄNGE(A2)=33`, `=ISTTEXT(A2)`, `=RECHTS(A2;5)` und `=SUMME(...)` |
