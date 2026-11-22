# Oracle SQL Developer Praxis — IDE, Suche, Joins & Excel-Export (`D001`–`D030`)

Dieses Praxis-Modul ergänzt das Grundlagen-Curriculum ([`1Z0-171`](../1Z0-171/README.md)) und das Aufbau-Curriculum ([`advanced`](../advanced/README.md)) **ausserhalb der Zertifizierungsziele** um die tägliche Arbeit mit **Oracle SQL Developer** (inklusive Hinweisen zur **Oracle SQL Developer Extension for VS Code** und **SQL Developer Web**).

> [!NOTE]
> **Ausserhalb der `1Z0-171`-Prüfung:** Keine dieser Techniken ist Prüfungsstoff im `1Z0-171`-Examen — sie sparen dir jedoch im Firmenalltag täglich Zeit und verhindern typische Datenfehler (wie zerstörte 33-stellige IDs beim Excel-Export).

---

## Schwerpunkte (6 Module · 30 Lektionen à 45 Min.)

| Modul | Lektionen | Fokus | Zentrale Inhalte & Workflows |
| :---: | :---: | :--- | :--- |
| **1** | `D001`–`D005` | **Oberfläche, Schachbrettmuster, Grid & NLS** | Schachbrett-/Zebramuster, `NULL`-Farbmarkierung, Schriftgrösse (≥ 16 pt), ISO-NLS-Formate, `F9` vs. `F5`, Fetch-Size (50 Zeilen) & Pin-Tabs |
| **2** | `D006`–`D010` | **Verbindungen, Import/Export & Schemenfilter** | Ordner & DEV/TEST/PROD-Farbcodierung, JSON-Export/-Import mit Passwort-Strategien, `tnsnames.ora`, `Andere Benutzer` (`Other Users`) & Objektfilter |
| **3** | `D011`–`D015` | **Objekte suchen & inspizieren** | `Datenbankobjekt suchen` (`Find DB Object`), Spalten- & Quelltextsuche (`SOURCE`), `Shift+F4`, `Ctrl+Click`, `Modell`-ERD, Reports & `ALL_*` |
| **4** | `D016`–`D020` | **Drag-and-Drop-Joins & Query Builder** | Navigator-Drag-and-Drop, visueller `Abfrage-Generator` (`Query Builder`), automatische/manuelle Joins, `INNER`/`OUTER`, Review & Risiken |
| **5** | `D021`–`D025` | **Schnellformatierungen & Produktivität** | `Strg+F7`, `Alt+'`, `Strg+/`, Team-Formatter-XML, Code-Templates (`ssf`, `ct`), Completion Insight, SQL History (`F8`) & `F5`-Output-Hints (`/*csv*/`) |
| **6** | `D026`–`D030` | **Daten & 33-stellige Zahlen nach Excel** | IEEE-754-15-Stellen-Falle, `SET NUMWIDTH 38`, Goldstandard `.xlsx` + `TO_CHAR(...)`, `CSV (UTF-8)` + Power Query (Text), Datums-/Umlaut-/50-Zeilen-Fallen |

---

## Voraussetzungen & Lab-Umgebung

- **Voraussetzungen**: Keine speziellen SQL-Vorkenntnisse für Module 1–3; für Module 4–6 sind Grundkenntnisse in `SELECT`, `WHERE` und `JOIN` (entspricht [`1Z0-171`](../1Z0-171/CURRICULUM.md) Phasen 1–5) hilfreich.
- **Ziel-Datenbank**: **Oracle AI Database 26ai (kompatibel mit 23ai Free)** — lokal, in einer Firmen-PDB (`PDB_TRAINING`) oder auf FreeSQL / OCI Autonomous Database.
- **Empfohlener Client**: Klassischer **Oracle SQL Developer (Desktop 23.1 / 24.3+)**; Unterschiede zur **Oracle SQL Developer Extension for VS Code** sind in jedem Modul explizit ausgewiesen.
- **Übungsskript**: Das eigenständige Lab-Skript [sqldeveloper-sandbox.sql](docs/labs/sqldeveloper-sandbox.sql) legt 3 FK-verknüpfte Tabellen (`sd_customers`, `sd_accounts`, `sd_transactions` inkl. 33-stelliger `NUMBER(38)`-Werte, führender Nullen, Umlaute, `'03-04'`-Codes, `CHR(10)` und 65+ Zeilen) sowie eine View (`sd_v_tx_export`) ohne `&`-Prompts an.

---

## Lehrbuchkapitel & Weiterführende Dokumente

- **[CURRICULUM.md](CURRICULUM.md)** — Vollständiger 30-Lektionen-Lehrplan (`D001`–`D030`)
- **[Modul 1 (`D001`–`D005`): Oberfläche, Schachbrettmuster, Grid & NLS](docs/modul-01-ui-grid-nls.md)**
- **[Modul 2 (`D006`–`D010`): Verbindungen, Import/Export & Schemenfilter](docs/modul-02-connections-filters.md)**
- **[Modul 3 (`D011`–`D015`): Objekte suchen & inspizieren](docs/modul-03-search-inspect.md)**
- **[Modul 4 (`D016`–`D020`): Drag-and-Drop-Joins & Query Builder](docs/modul-04-dragdrop-joins.md)**
- **[Modul 5 (`D021`–`D025`): Schnellformatierungen & Produktivität](docs/modul-05-formatting-productivity.md)**
- **[Modul 6 (`D026`–`D030`): Daten & 33-stellige Zahlen nach Excel](docs/modul-06-excel-export.md)**
- **[Checkpoints (`DCP-1` & `DCP-2`)](docs/checkpoints.md)** — Halbzeit- und Abschluss-Check
- **[sqldeveloper-sandbox.sql](docs/labs/sqldeveloper-sandbox.sql)** — Komplettes Setup-Skript ohne `&`-Prompts
- **[sqldeveloper-solutions.sql](docs/labs/sqldeveloper-solutions.sql)** — Musterlösungen für alle Labs
