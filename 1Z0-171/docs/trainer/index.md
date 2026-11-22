# Kursstart in der Firma: Trainer- & Organisationsleitfaden (vor Tag 1)

Dieser Bereich ergänzt das Selbststudium-Handbuch für **firmeninterne Hybrid-Kurse** (6 Teilnehmende total: 3 vor Ort im Schulungsraum, 3 über Microsoft Teams, 1 Lehrperson). Alle Checkpoints, IT-Vorabklärungen und Routen sind so gestaltet, dass der Kurs im Arbeitsalltag ohne Reibungsverluste startet.

---

## 1. Auftakt & Zielklärung vor Tag 1 (`E2`)

Erwachsene lernen ziel- und problemorientiert. Kläre **vor Beginn** in einem 15-minütigen Onboarding-Call oder kurzen Fragebogen:

1. **Kursziel je Person**:
   - **Route A — Anwender-Pfad (Praxis im Job, ~60–75 Std.)**: Fokus auf Datenabfragen für Reporting, Analyse und Fachbereich (`Phase 1–6` + `Phase 9` Data Dictionary/Zeitzonen, optional ergänzt um **[SQL Developer Praxis (`D001`–`D030`)](../sqldeveloper/modul-01-ui-grid-nls.md)** für Objektsuche, Filter & verlustfreien Excel-Export). Keine Zertifizierungsprüfung nötig.
   - **Route B — Zertifizierungs-Pfad (`1Z0-171`, ~150 Std.)**: Alle 10 Phasen inkl. DML/DDL/DCL, Human Compiler Clinics und Mock Exams.
2. **Vorwissen**: Wer kennt Excel/Pivot, wer hat bereits SQL gelesen, wer startet bei null?
3. **Verfügbare Lernzeit pro Woche**: Realistische Wochenstunden zwischen den Terminen (inkl. Zusage durch Vorgesetzte).
4. **Lern-Backlog aus dem Arbeitsalltag**: Jede Person bringt **1–2 reale Datenfragen** aus dem eigenen Job mit (z. B. Monatsauswertung, Dubletten-Suche, Join zweier Fachsysteme). Diese fliessen in den Transfer-Aufgaben der Phasen 1–10 ein.
5. **Anrede**: Duzen oder Siezen vorab mit dem Unternehmen klären (das Handbuch verwendet „du“).

---

## 2. Datenschutz & Bewertung gegenüber dem Arbeitgeber (`E4`)

> [!IMPORTANT]
> **Verbindliche Grundregel (vor Kursstart kommunizieren):**
> Checkpoints (`CP-0` bis `CP-5`), Mock-Exam-Scores und Reflexionen sind **reine Lern- und Standortbestimmungen** für die Teilnehmenden selbst. Es gibt **keine Weitergabe individueller Punktzahlen oder Fehlerquoten an Vorgesetzte oder HR**.

- An Auftraggeber/Vorgesetzte wird ausschliesslich gemeldet: **Teilnahme** und (falls vereinbart) **Abschluss des Kurses / Teilnahme an der Zertifizierung**.
- Freiwillige Gruppen-Auswertungen im Kurs (z. B. um gemeinsame Lücken zu erkennen) erfolgen **anonymisiert** und nur mit Einverständnis aller 6 Teilnehmenden.

---

## 3. Firmen-IT-Vorabklärung & Fallbacks (`E7`)

Kläre **mindestens 10 Arbeitstage vor Kurstag 1** mit der Firmen-IT:

| Prüfpunkt | Bedarf | Fallback bei Blockade |
| :--- | :--- | :--- |
| **Datenbank-Zugang (bevorzugt)** | Gemeinsame In-House-PDB (`PDB_TRAINING`, Port `1521`) mit `student_01..06` erreichbar **aus dem Schulungsraum UND über Firmen-VPN** | OCI Always Free Autonomous Database (26ai/23ai) je Person mit Wallet-Download, falls kein interner Oracle-Server existiert |
| **SQL-Client auf Firmen-Laptops** | **VS Code + Oracle SQL Developer Extension** oder klassischer **Oracle SQL Developer**, plus **SQLcl** / **SQL\*Plus** | Browser-basiertes **Oracle SQL Developer Web / APEX SQL Workshop** auf der PDB oder OCI ADB (kein lokaler Client nötig) |
| **Externe URLs / Proxy** | Freigabe für `chatelao.github.io` (Interactive Studio), `sql-schulung.readthedocs.io` (Handbuch), `docs.oracle.com` (Referenz) | Handbuch offline per `mkdocs build` als statisches ZIP/Intranet bereitstellen; Studio läuft lokal über `index.html` |
| **Browser-`localStorage`** | Firmen-Browser löschen beim Schliessen manchmal `localStorage` | Am Ende jeder Sitzung 1 Klick auf **„Lernstand sichern (.json)“** und Datei in OneDrive/Teams ablegen |
| **Admin-/Docker-Rechte** | Nicht vorausgesetzt! Teilnehmende installieren keine eigenen Container | Zentrale Trainings-PDB (`student_01..06`) entlastet alle Teilnehmenden von lokalem Docker-Setup |

---

## 4. Verbindliche Lab-Umgebung & Setup-Check (`H5`)

Für die 6er-Gruppe wird **genau eine gemeinsame Umgebung** genutzt (keine Mischung aus FreeSQL und lokaler DB innerhalb derselben Übung):

- **Empfehlung:** Eine gemeinsame Trainings-PDB (`PDB_TRAINING`) mit 6 Accounts (`student_01` bis `student_06`, plus Peer-Accounts für Phase 9 DCL) — siehe [Variante A: Option A2](../getting-started/variant-a-inhouse.md#option-a2-schulungsserver-in-house-pluggable-database-pdb).
- **Pflicht-Check vor Kurstag 1:** Jede Person führt den Smoke-Test aus `Variante A` einmal **von genau dem Laptop und Netzwerk** aus, mit dem sie am Kurs teilnimmt (Remote-Teilnehmende über Firmen-VPN!):

```sql
SELECT d.dname, COUNT(e.empno) AS headcount
FROM scott.dept d
LEFT JOIN scott.emp e ON d.deptno = e.deptno
GROUP BY d.dname
ORDER BY d.dname;
-- Erwartet: 4 Zeilen, darunter OPERATIONS mit headcount = 0
```

---

## 5. Zeitmodelle für den Firmenalltag (`H10`)

Ein reines 8×45-Min.-Vollzeitformat erzeugt bei Remote-Teilnehmenden starke Bildschirmermüdung und kollidiert mit dem Tagesgeschäft. Bewährte Formate für 6 Berufstätige (Flipped-Classroom-Prinzip: **ca. 40 % gemeinsame Hybrid-Zeit / 60 % Selbststudium**):

| Modell | Präsenz-/Teams-Takt | Selbststudium dazwischen | Dauer (Route A / B) |
| :--- | :--- | :--- | :---: |
| **Berufsbegleitend (Empfohlen)** | **2 × 90 Min. pro Woche** (z. B. Di & Do 09:00–10:30 Uhr) | 2–3 Std./Woche (Lektionen lesen, Lab-Aufgaben, Flashcards) | 12 Wochen (Route A) / 24 Wochen (Route B) |
| **Kompakt-Halbtage** | **1 × 3,5 Std. pro Woche** (inkl. 2× 15 Min. Pause) | 2–3 Std./Woche | 10 Wochen / 20 Wochen |
| **Blockwoche (Intensiv)** | **Mo–Fr jeweils 08:30–12:00 & 13:30–16:00** (max. 20 Min. Input am Stück, Pause alle 50 Min.) | Abends 30 Min. Flashcards + Review | 2 Blockwochen (Route A) / 4 Blockwochen (Route B) |

### Regeln für hybride Kurstage
- **Keine Blöcke länger als 50 Min. ohne Pause** (5–10 Min. echte Bildschirmpause).
- **Maximal 15–20 Min. Lehrperson-Input am Stück**, danach sofort Aktivierung (Predict-Pause, Paaraufgabe, Live-Abfrage).
- **Kalender-Blocker inkl. „Nicht stören“** im Firmenkalender eintragen lassen.

### Nachhol-Pfad bei Fehlzeiten
Fällt eine Person wegen Projekt-/Kundenterminen aus, nutzt sie den **Nachhol-Pfad** im jeweiligen [Sitzungsplan](sitzungsplaene.md) (verlinkte Handbuch-Lektionen + Lab-Skript + 3 Kontrollfragen). Aufzeichnungen von Input-Phasen in Teams nur mit ausdrücklichem Einverständnis aller 6 Teilnehmenden.

---

## 6. Modulkarten: Präsenz vs. Selbststudium (`E6`)

| Modul / Phase | Route A (Anwender) | Route B (1Z0-171) | Hybrid-Zeit | Selbststudium | Abschlusskriterium |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Phase 1–2 (`L001–L042`) | Pflicht | Pflicht | 6 Std. | 9 Std. | Smoke-Test + `CP-1` |
| Phase 3–4 (`L043–L082`) | Pflicht | Pflicht | 7,5 Std. | 12 Std. | Functions/Grouping-Lab + `CP-2` |
| Phase 5–6 (`L083–L122`) | Pflicht | Pflicht | 9 Std. | 14 Std. | Join-/Subquery-Lab + `CP-3` |
| Phase 7–8 (`L123–L162`) | Optional | Pflicht | 7,5 Std. | 12 Std. | DML-/DDL-Lab + `CP-4` |
| Phase 9 (`L163–L178`) | Teilweise | Pflicht | 3 Std. | 5 Std. | Dictionary & Time Zones |
| Phase 10 (`L179–L200`) | — | Pflicht | 3 Std. | 8 Std. | Mock #1/#2 ≥ 75 %, `CP-5` ≥ 85 % |
| SQL Developer Praxis (`D001–D030`) | Optional (empf.) | Optional | 6 Std. | 16,5 Std. | `DCP-1` & `DCP-2` (inkl. Excel-Check) |

---

## 7. Transfer-Sicherung nach Kursende (`E5`)

1. **Persönlicher Transfer-Plan (in Phase 10):** Jede Person definiert **3 konkrete SQL-Abfragen/Prüfungen**, die sie in den nächsten 4 Wochen im Job umsetzt.
2. **Follow-up-Termin (60 Min., nach 4–6 Wochen):** Alle 6 treffen sich erneut in Teams; jede Person zeigt 1 echte Praxis-Query (anonymisierte Daten) und bespricht aufgetretene Stolpersteine.
3. **Interner Teams-Kanal „SQL-Praxis“:** Bleibt nach Kursende als Peer-Hilfe für Alltagsfragen offen.

---

## Weiterführend im Trainer-Bereich
- [Technik- & Raum-Checkliste Hybrid (3 vor Ort + 3 Teams)](hybrid-raum-checkliste.md)
- [Sitzungspläne & Hybrid-Moderation (Phasen 1–10)](sitzungsplaene.md)
- [Hybrid-Foliendeck (Marp, Phasen 1–10)](../slides/phase-01-10-overview.md)
