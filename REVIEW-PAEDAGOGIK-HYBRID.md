# Review: Eignung für Selbststudium & hybriden Frontunterricht

**Stand:** v1.1.0 (21.11.2026) · **Geprüft:** `1Z0-171/` (Handbuch, Labs, Interactive Studio), `advanced/`
**Szenario B:** Firmeninterne Erwachsenenbildung, **6 Teilnehmende total** — 3 via Microsoft Teams, 3 vor Ort im Schulungsraum, eine Lehrperson.

Massstäbe: Constructive Alignment (Biggs), Bloom-Taxonomie (revidiert), Cognitive Load Theory / Worked-Example-Fading (Sweller), Retrieval Practice, Spacing & Interleaving (Dunlosky et al. 2013), formatives Feedback (Hattie/Timperley), Multimedia-Prinzipien (Mayer), Universal Design for Learning (UDL 3.0) & WCAG 2.2 AA, Community of Inquiry (Garrison), **Andragogik (Knowles: Relevanz, Erfahrungsbezug, Selbststeuerung, Problemorientierung)**, **Lerntransfer in den Arbeitsalltag (Kirkpatrick Stufe 3)**, Hybrid-/HyFlex-Didaktik (Beatty; „Remote first“-Prinzip).

---

## 1. Gesamturteil

| Bereich | Urteil | Kurzbegründung |
| :--- | :---: | :--- |
| **Selbststudium 1Z0-171** | 🟢/🟡 **Gut, mit Lücken** | Starke Grundlage: Lernziele, Retrieval Practice, Spacing, identische Checkpoints, Confidence-Kalibrierung, Musterlösungen. Schwächen: Lösungsdichte nimmt ab Phase 4 stark ab, kaum Visualisierungen, kein Fading, keine soziale Komponente, Barrierefreiheit ungeprüft. |
| **Selbststudium `advanced/`** | 🟠 **Ungenügend** | 60 Lektionen (45 h) auf 6 Seiten mit je 57–94 Zeilen und nur **1 Musterlösung pro Modul**. Keine Lektionsgranularität, keine Lernziele je Lektion, keine Checkpoints. |
| **Hybrider Frontunterricht** | 🔴 **Nicht geeignet (Stand heute)** | Material ist durchgängig für Einzellernende geschrieben („du“). Es fehlen Trainer-Leitfaden, Folien, Hybrid-Ablaufpläne, Paar-Formate, einheitliche Lab-Umgebung und Gruppen-Auswertung. Zudem fehlt der **Bezug zu den Firmendaten/-aufgaben** der Teilnehmenden (Andragogik, Transfer). Die kleine Gruppe (6) ist ein Vorteil: Viele Hybrid-Probleme sind mit geringem Aufwand lösbar. |

---

## 2. Selbststudium — Stärken (beibehalten)

- **Constructive Alignment**: 175× explizite Lernziele; Checkpoints messen die 11 Exam-Domains, auf die die Phasen hinführen.
- **Retrieval Practice & Spacing**: Warm-Up-Flashcards (80, Spaced-Repetition-Status), Human-Compiler-Drills, 6 identische Checkpoints.
- **Metakognition**: Confidence-Rating vor Score, Blind-Spot-Analyse, Reflexionslog — entspricht aktuellem Stand (Kalibrierung).
- **Vorhersagen vor Ausführen** (Predict–Run–Investigate) ist als Regel verankert.
- **Konkret vor abstrakt**: kleines SCOTT-Schema vor HR; erwartete Ausgaben abgedruckt.
- **Self-Study-Guide** mit Entscheidungsbaum, Lektionsablauf und 3 Tempo-Varianten.

## 3. Selbststudium — Mängel & Verbesserungsvorschläge

| # | Mangel | Massstab | Verbesserungsvorschlag | Prio |
| :-: | :--- | :--- | :--- | :-: |
| S1 | **Abnehmende Übungs-/Lösungsdichte**: Musterlösungen pro Phase: P1 = 12, P2 = 6, P3 = 4, P4–P6 = 3, P7 = 1, P8 = 2, P9 = 1, P10 = 0. Gerade die schwierigen Phasen (DML/TCL, DDL, DCL) sind am dünnsten. | Formatives Feedback, Übung mit Rückmeldung | Mindestens **1 Selbstlern-Aufgabe mit `??? success`-Lösung pro Lektion** (Ziel ≈ 180 statt 35). Prüfung via Skript (analog `check_refs.py`). | Hoch |
| S2 | **Kein Worked-Example-Fading**: Das Curriculum verspricht „Abtippen → Lückentext → eigenständig“, das Handbuch enthält aber fast nur Vollbeispiele + freie Aufgaben. | Cognitive Load Theory | Je Lektion drei Stufen: (1) vollständiges Beispiel, (2) **Parsons-/Lückentext-Aufgabe** (`SELECT ___ FROM …`), (3) freie Aufgabe. | Hoch |
| S3 | **Kaum Visualisierungen**: 1 Mermaid-Diagramm im gesamten Handbuch, keine Bilder. Joins, NULL-Logik, GROUP BY, Transaktionen, Execution Order sind stark visuell lernbar. | Multimedia-Prinzip (Mayer) | Mermaid/SVG für: logische Abarbeitungsreihenfolge, Join-Typen (Venn + Tabellen), 3-wertige Logik (Wahrheitstabelle), TCL-Zeitachse (Savepoints), ERD SCOTT/HR. Alt-Texte ergänzen. | Hoch |
| S4 | **Bloom-Stufen nicht ausgewiesen**: Lernziele überwiegend „Du kannst … schreiben“ (Anwenden). Analysieren/Bewerten (z. B. „Welche von 3 Queries ist korrekt und warum?“) fehlt im Handbuch. | Revidierte Bloom-Taxonomie | Lernziele mit Bloom-Verb und Stufe taggen; je Phase ≥ 2 Analyse-/Debugging-Aufgaben („Finde den Fehler“, „Vergleiche zwei Lösungen“). | Mittel |
| S5 | **Interleaving fehlt im Handbuch**: Übungen sind blockweise thematisch; gemischte Wiederholungen nur in Checkpoints/Mock. | Interleaved Practice | Am Ende jeder Phase ein **„Gemischtes Training“** mit Aufgaben aus allen bisherigen Phasen. | Mittel |
| S6 | **Keine soziale Präsenz** für Selbstlernende: keine Diskussionsplattform, keine Peer-Review-Aufgaben. | Community of Inquiry | GitHub Discussions aktivieren (Kategorien je Phase); Peer-Review-Aufgabe pro Checkpoint („Tausche Part-B-Lösung, bewerte mit Rubrik“). | Mittel |
| S7 | **Keine Bewertungsrubrik** für offene SQL-Aufgaben (Checkpoint Part B). | Transparente Kriterien | Rubrik (Korrektheit, NULL-Sicherheit, Lesbarkeit, Performance-Bewusstsein) je 0–2 Punkte im Benchmark-Guide. | Mittel |
| S8 | **Barrierefreiheit ungeprüft**: Interactive Studio hat nur 10 `aria-`Attribute; Farbcodierung (Scores) ohne Textalternative nicht geprüft; keine Tastatur-Navigationstests. | WCAG 2.2 AA, UDL | Audit mit axe/Lighthouse in CI; Fokus-Reihenfolge, Kontraste, `aria-live` für Feedback; Charts mit Tabellen-Fallback. | Mittel |
| S9 | **Versions-Inkonsistenz**: Links zeigen auf 26ai, der Text nennt 40× „23ai“. Verwirrt Selbstlernende („welche Version installiere ich?“). | Kohärenz | Einheitliche Sprachregelung: „Oracle AI Database 26ai (kompatibel mit 23ai Free)“ an einer Stelle definieren, Rest angleichen. | Niedrig |
| S10 | **`advanced/` zu dünn** (s. Gesamturteil): 60 Lektionen ohne Lektionsseiten, 6 Musterlösungen insgesamt, keine Checkpoints, keine Studio-Integration. | Alignment, Feedback | `advanced` analog 1Z0-171 aufbauen: Lektionsüberschriften `A001–A060` mit Lernziel/Beispiel/Aufgabe/Lösung, 2 Checkpoints (nach Modul 3 und 6), Tracker-Einträge im Studio. | Hoch |
| S11 | **Lernstand nur im `localStorage`**: Risiko Datenverlust; kein geräteübergreifendes Lernen. | Lernendenautonomie | Optional: Export/Import per Datei bleibt; zusätzlich Hinweis-Banner nach 7 Tagen ohne Backup. | Niedrig |

---

## 4. Hybrider Frontunterricht (3 Teams + 3 vor Ort, Firmenkontext) — Mängel & Vorschläge

### 4.1 Ausgangslage
Das Material ist ein **Selbstlern-Lehrbuch**. Für Frontunterricht fehlt die **Lehrpersonen-Ebene** und die Planung für **zwei gleichzeitige Lernorte**. Ohne Anpassung entsteht das typische Hybrid-Gefälle: Die Remote-Gruppe wird zu Zuschauenden, Raumgespräche sind in Teams unhörbar.

**Chancen der Kleingruppe (6 Erwachsene):** genau **3 gemischte Paare** (je 1 vor Ort + 1 remote); alle 6 passen in eine Teams-Galerie; Lehrperson kann jede Person individuell begleiten; Plenumsgespräch statt Frontalvortrag möglich. Breakout-Logistik, Klassen-Dashboards und aufwendige Quiz-Tools sind **weniger kritisch** als bei grossen Klassen.

**Besonderheiten Erwachsenenbildung in der Firma:** Teilnehmende bringen Berufserfahrung und konkrete Datenfragen mit, lernen neben dem Tagesgeschäft (Unterbrechungen, Fehlzeiten), erwarten direkten Nutzen und sind oft heterogen (z. B. Fachabteilung vs. IT). Prüfungs- und Lernstandsdaten sind gegenüber Vorgesetzten sensibel.

### 4.2 Mängel & Vorschläge — Hybrid-Durchführung

| # | Mangel | Verbesserungsvorschlag | Prio |
| :-: | :--- | :--- | :-: |
| H1 | **Kein Trainer-Leitfaden** (Ablauf, Zeiten, Kernaussagen, typische Fehler). | `docs/trainer/`: pro Phase ein **Sitzungsplan** (Blöcke à 90 Min.), Kernbotschaften, Whiteboard-Skizze, häufige Missverständnisse, Plus-/Challenge-Aufgaben, Lösungshinweise. | Hoch |
| H2 | **Keine Präsentationsfolien**; Handbuchseiten sind zum Lesen, nicht zum Projizieren gemacht. | Schlanke Folien aus Markdown (z. B. **Marp**), 1 Deck pro Phase, max. 1 Konzept pro Folie, ≥ 24 pt, hoher Kontrast für Beamer *und* Teams-Screensharing. Bei 6 Personen genügt oft Live-Coding + Handbuch im Screen-Share; Folien nur für Konzepte. | Mittel |
| H3 | **45-Min.-Lektionsablauf nicht hybridfähig** (keine Interaktion zwischen Lernorten). | **Hybrid-Lektionsschema**: 5′ Warm-Up (Teams-Umfrage, alle 6 im Teams-Meeting) → 10′ Konzept (Screen-Share) → 15′ Live-Coding mit **„Predict“-Pausen** (Vorhersage in Teams-Chat, Namen aufrufen: abwechselnd remote/vor Ort) → 12′ Übung in **3 gemischten Paaren** → 3′ Blitzlicht reihum (remote zuerst). | Hoch |
| H4 | **Keine Paar-/Kollaborationsformate.** | **Feste gemischte Paare** (rotierend pro Kurstag): Person vor Ort mit Laptop + Headset, Paar im eigenen Teams-Breakout oder Chat-Call, Screen-Sharing im Wechsel **Driver/Navigator** (Rollenwechsel alle 10 Min.). Je Phase 2 Paaraufgaben + 1 Gruppenaufgabe (alle 6, z. B. gemeinsames Review einer Query). | Hoch |
| H5 | **Uneinheitliche Lab-Umgebung** (lokal vs. FreeSQL; SQL*Plus-Variablen, DCL, Multi-Session verhalten sich unterschiedlich). | **Eine verbindliche Umgebung für alle 6**: firmeninterne Trainings-PDB (Variante A, Remote-Zugang über Firmen-VPN) mit 6 Usern `student_01..06` — inkl. IT-Freigabe, Firewall, Client (SQL Developer/VS Code + SQLcl) auf Firmen-Laptops. **Setup-Check vor Kurstag 1** (15-Min.-Einzeltermin oder Checkliste). | Hoch |
| H6 | **Keine Gruppen-Auswertung**: Checkpoints laufen pro Browser; Lehrperson sieht Lücken nicht. | Leichtgewichtig bei 6 Personen: Teilnehmende teilen freiwillig ihren JSON-/Markdown-Export; Skript `scripts/class_report.py` erzeugt **anonymisierte** Domain-Übersicht. Optional Trainer-Modus mit Answer Key. | Mittel |
| H7 | **Kein Raum-/Technik-Setup** dokumentiert (Raum-Mikro, Echo, Lehrperson/Whiteboard für Remote unsichtbar). | Checkliste „Hybrid-Raum (klein)“: Konferenz-Lautsprecher/-Mikro *oder* alle 3 vor Ort mit Headset im Teams-Meeting (bei 3 Personen meist die einfachste Lösung, Raum-Lautsprecher dann aus), Kamera auf Lehrperson, **Teams Whiteboard** statt Wandtafel, Teams-Galerie auf zweitem Bildschirm im Raum. Technik-Probe 10 Min. vor Beginn. | Hoch |
| H8 | **Keine Moderationsregeln** (Lehrperson kann Live-Coding, Raum und Chat nicht gleichzeitig betreuen). | Regeln statt Zusatzrollen: **„Remote first“** bei Fragen; Chat-Blick nach jedem Codebeispiel; rotierender **Chat-Buddy** vor Ort (bei 6 Personen ausreichend). | Mittel |
| H9 | **Keine Plenums-Aktivierung** (Flashcards/Drills nur Einzelmodus). | Human-Compiler-Drills per Screen-Share als **Abstimmung** (Daumen/Reaktion in Teams, Begründung reihum). Ein Klassenmodus im Studio ist „nice to have“. | Niedrig |
| H10 | **Zeitmodell** passt nicht zum Firmenalltag (Meetings, Tagesgeschäft, Bildschirmermüdung remote). | Firmenformat definieren: z. B. **2 × 90 Min. pro Woche** oder Halbtage (4 × 45 Min.) mit Pausen alle 45–60 Min., max. 20 Min. Input am Stück. Vorbereitung/Vertiefung zwischen Terminen per Selbststudium (**Flipped Classroom**). Kalender-Blocker inkl. „nicht stören“. | Hoch |
| H11 | **Heterogene Gruppe, keine Differenzierung.** | Jede Übung mit **Basis / Plus / Challenge**; Vorwissens-Check (CP-0) zur Paarbildung nutzen (stärker + schwächer gemischt). | Mittel |
| H12 | **Umgang mit Fehlzeiten** nicht geregelt (in Firmenkursen häufig). | Pro Sitzung „**Nachhol-Pfad**“: verlinkte Handbuch-Lektionen + Lab-Datei + 3 Kontrollfragen; optional Teams-Aufzeichnung der Input-Phasen (mit Einverständnis). | Mittel |

### 4.3 Mängel & Vorschläge — Erwachsenenbildung / Firmenkontext

| # | Mangel | Verbesserungsvorschlag | Prio |
| :-: | :--- | :--- | :-: |
| E1 | **Kein Praxis-/Firmenbezug**: Beispiele ausschliesslich SCOTT/HR. Erwachsene lernen problemorientiert und wollen Relevanz für ihre Arbeit sehen. | Pro Phase 1 **Transfer-Aufgabe** „Übertrage auf deine Daten“: eigene Fragestellung aus dem Arbeitsalltag (oder anonymisiertes Firmen-Schema als 3. Übungsschema). Teilnehmende bringen bei Kursstart 1–2 echte Datenfragen mit („Lern-Backlog“). | Hoch |
| E2 | **Lernziele/Erwartungen der Teilnehmenden nicht erhoben**; Kurs ist starr auf Zertifizierung ausgerichtet. | Auftaktgespräch: Ziele (Zertifikat vs. Arbeitsnutzen), Vorwissen, verfügbare Zeit. Zertifizierung als **optionaler Pfad**; für reine Anwender:innen kürzere Route (z. B. Phasen 1–6 + Teile 9) definieren. | Hoch |
| E3 | **Ton und Didaktik teils schulisch** („Checkpoint“, „Schwächste Domain“, CP-Prozentwerte im Vergleich). | Formative Checkpoints klar als **persönliche Standortbestimmung** kennzeichnen; keine Rangfolgen; Sprache auf Augenhöhe. Duzen/Siezen mit der Firma abstimmen. | Mittel |
| E4 | **Datenschutz gegenüber Arbeitgeber** nicht geregelt (Lernstände, Mock-Ergebnisse, Reflexionen). | Explizite Regel im Kursleitfaden: Ergebnisse bleiben bei den Teilnehmenden; an Auftraggeber nur Teilnahme/Abschluss. Gruppen-Auswertung (H6) nur anonymisiert und freiwillig. | Hoch |
| E5 | **Kein Transfer-Sicherungskonzept** nach Kursende. | Transfer-Plan pro Person (3 konkrete Anwendungen in 4 Wochen), Follow-up-Termin (60 Min.) nach 4–6 Wochen, interner Teams-Kanal für Fragen. | Mittel |
| E6 | **Zeitumfang 150 h** ist für Firmenkurse sehr hoch und nicht modularisiert ausgewiesen. | Modulkarten mit Präsenzanteil vs. Selbststudium (z. B. 40 % Präsenz / 60 % Selbststudium), Aufwand pro Modul und Abschlusskriterium; ermöglicht Planung mit Vorgesetzten. | Mittel |
| E7 | **Firmen-IT-Restriktionen** nicht berücksichtigt (keine Docker-Rechte, Proxy, FreeSQL/GitHub Pages ggf. blockiert, Browser-`localStorage` gelöscht). | IT-Vorabklärung als Checkliste (erlaubte URLs, Client-Installation, DB-Zugang); Fallbacks dokumentieren. | Hoch |

---

## 5. Empfohlene Umsetzungsreihenfolge

1. **Sprint 1 (Kursstart Firma, vor Tag 1):** E2, E4, E7, H5, H7, H10 — Erwartungen/Ziele, Datenschutz-Regel, IT-Vorabklärung, einheitliche Trainings-PDB, Raum-Checkliste, Zeitformat. *Ohne diese ist der Kurs nicht durchführbar.*
2. **Sprint 2 (Unterricht):** H1, H3, H4, E1 — Trainer-Leitfaden, Hybrid-Lektionsschema, Paaraufgaben, Transfer-Aufgaben mit Firmenbezug.
3. **Sprint 3 (Selbstlernqualität):** S1, S2, S3 — Lösungsdichte, Fading-Stufen, Diagramme.
4. **Sprint 4 (`advanced/`):** S10 vollständig nach 1Z0-171-Muster.
5. **Sprint 5 (Feinschliff):** S4–S9, S11, H2, H6, H8, H9, H11, H12, E3, E5, E6.

## 6. Prüfkriterien („Definition of Done“)

- [ ] Jede Lektion `L001–L200` hat Lernziel (mit Bloom-Stufe), ≥ 1 Aufgabe mit Lösung — automatisiert geprüft.
- [ ] Jede Phase hat ≥ 3 Diagramme mit Alt-Text, 1 gemischtes Training, 2 Gruppenaufgaben.
- [ ] `docs/trainer/` enthält 10 Sitzungspläne, Hybrid-Raum-Checkliste, IT-Vorabklärung, Datenschutz-Regel und Nachhol-Pfade.
- [ ] Jede Phase hat 2 Paaraufgaben (gemischt remote/vor Ort) und 1 Transfer-Aufgabe mit Firmenbezug.
- [ ] Trainings-PDB mit `student_01..06` von Firmen-Laptops vor Ort und über VPN erreichbar.
- [ ] Anonymisierte Gruppen-Übersicht aus bis zu 6 freiwilligen JSON-Exporten.
- [ ] Lighthouse-Accessibility-Score Interactive Studio ≥ 90.
- [ ] `advanced/`: 60 Lektionsabschnitte, 2 Checkpoints, Studio-Tracker.
