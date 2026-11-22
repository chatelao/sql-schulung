# Selbststudium-Leitfaden (Ohne Trainer zum Erfolg)

Dieses Curriculum ist so aufgebaut, dass du **komplett eigenständig ohne Dozent** von null SQL-Kenntnissen bis zur bestandenen Prüfung **Oracle AI Database SQL Associate (`1Z0-171`)** gelangst. Diese Seite zeigt dir exakt, wie du die drei Werkzeuge im Alltag kombinierst, deine Ergebnisse selbst prüfst und typische Selbstlern-Fallen vermeidest.

---

## Dein 3-Fenster-Setup für jede Lerneinheit

Lege dir für das Selbststudium drei Browser-Tabs (oder Fenster) nebeneinander bereit:

1. **Tab 1 — Lehrbuch (Read the Docs)**: Hier liest du das Konzept, schaust dir das ausgearbeitete Beispiel mit erwarteter Ausgabe an und löst die Mikro-Aufgaben (Lösungen bleiben zunächst zugeklappt).
2. **Tab 2 — [Interactive Studio (GitHub Pages)](https://chatelao.github.io/sql-schulung/)**: Hier hakst du abgeschlossene Lektionen (`L001`–`L200`) ab, machst die 5-Minuten-Warm-up-Flashcards, übst mit Visualizern/Simulator und absolvierst die 6 Checkpoints (`CP-0` bis `CP-5`) sowie die beiden Mock Exams.
3. **Tab 3 — Deine Oracle-Datenbank**: Entweder **Oracle FreeSQL** (`freesql.com`, Variante B) im Browser oder **VS Code / `sqlcl`** gegen deine lokale Oracle 26ai / 23ai Free Datenbank (Variante A).

---

## Entscheidungsbaum: Variante A oder Variante B?

Beantworte drei kurze Fragen:

1. *Darfst du auf deinem Rechner Docker/Podman installieren und hast mindestens 8 GB freien RAM?*
   - **Ja** → **[Variante A (In-House / Lokaler Container)](variant-a-inhouse.md)** deckt 100 % aller Themen lokal ab.
   - **Nein** → **[Variante B (Kostenlose Online-Cloud)](variant-b-online.md)** startet in 60 Sekunden im Browser.
2. *Möchtest du heute direkt SQL schreiben, ohne erst 15–30 Minuten Setup zu machen?*
   - **Ja** → Starte sofort mit **Oracle FreeSQL** (Variante B) und wechsle bei Bedarf später auf Variante A.
3. *Was machst du bei `sqlplus`-Variablen (`&`/`&&`) und Multi-User-DCL (`GRANT`/`REVOKE`) in Variante B?*
   - Für `&`/`&&` nutzt du den eingebauten **[SQL\*Plus Simulator](https://chatelao.github.io/sql-schulung/#labs/sqlplus)** und die **[SQL\*Plus Spool-Transkripte](../cheatsheets/sqlplus-transcripts.md)**.
   - Für Multi-Session-Locking (Phase 7) und Multi-User-DCL (Phase 9) nutzt du **OCI Always Free Autonomous Database** (kostenlos, 2 Browser-Tabs).

---

## Ablauf einer 45-Minuten-Lektion im Selbststudium

| Zeit | Schritt | Was du konkret tust | Selbstkontrolle |
| :-: | :--- | :--- | :--- |
| **0–5 Min.** | **Warm-Up Recall** | Öffne im Interactive Studio die [Flashcards](https://chatelao.github.io/sql-schulung/#flashcards) zur aktuellen Domain und beantworte 3 Karten aus dem Gedächtnis. | Nutze „Sicher / Unsicher“, um Lücken sofort zu markieren. |
| **5–15 Min.** | **Konzept & Beispiel** | Lies die Lektion im Handbuch, verstehe das `SCOTT`-Beispiel und prüfe die abgedruckte Beispiel-Ausgabe. | Decke das Ergebnis kurz ab und überlege, warum genau diese Zeilen erscheinen. |
| **15–30 Min.** | **Live ausprobieren** | Tippe die Beispiel-Query (oder lade das Phasen-Lab in FreeSQL) und führe sie aus. Provoziere auch absichtlich die genannten `ORA-`-Fehler. | Vergleiche deine Ausgabe Zeile für Zeile mit der erwarteten Ausgabe. |
| **30–42 Min.** | **Selbstlern-Aufgaben** | Löse die 2–3 Mikro-Aufgaben der Lektion **zuerst ohne Spicken**. Prüfe Zeilenzahl und Ergebnis in deiner DB. | Klappe erst **danach** `Musterlösung & Erklärung` im Handbuch auf. |
| **42–45 Min.** | **Exam Trap & Haken** | Notiere die Exam Trap der Lektion in deinen eigenen Worten und hake die Lektion im [Curriculum-Tracker](https://chatelao.github.io/sql-schulung/#curriculum) ab. | Einmal pro Woche: Klicke auf **„Lernstand sichern (.json)“**! |

---

## Die 5 goldenen Selbstlern-Regeln

1. **Vorhersagen vor Ausführen**: Rate niemals blind durch Klicken auf „Run“. Schreibe oder sage dir bei jeder Übung vorher laut: *„Diese Query liefert 4 Zeilen“* oder *„Diese Query wirft `ORA-00904`“*.
2. **Kein Auswendiglernen der Checkpoint-Fragen**: `CP-0` bis `CP-5` verwenden sechsmal dieselben 22 Fragen als Messlatte. Lasse die Lösungen bis `CP-5` gesperrt — nutze sie nicht als Lernkartei, sondern nur zur ehrlichen Standortbestimmung.
3. **Sichere deinen Browser-Fortschritt**: Das Interactive Studio speichert alle Haken, Checkpoints, Reflexionen und Flashcards im `localStorage` deines Browsers. Exportiere **einmal pro Woche** ein JSON-Backup über den Button im Studio, damit beim Geräte- oder Browserwechsel nichts verloren geht.
4. **Fehler sind Datenpunkte**: Jeder `ORA-`-Fehler ist willkommen. Schlage ihn sofort im [ORA-Fehler-Lexikon](../cheatsheets/ora-errors.md) nach.
5. **Übungen erst schreiben, dann vergleichen**: In `docs/labs/` findest du sowohl die Übungsskripte (`phase-XX-*.sql` mit `-- TODO:`-Aufgaben) als auch separate Lösungsskripte (`phase-XX-*-solutions.sql`). Öffne die Lösungen erst nach eigenem Versuch.

---

## Selbstlern-Wochenpläne im Überblick

| Tempo | Dauer | Wochenpensum | Empfohlener Rhythmus |
| :--- | :---: | :---: | :--- |
| **Vollzeit-Sprint** | 5 Wochen | 40 Lektionen/Woche | 8 Lektionen/Tag (Mo–Fr), je 1–2 Phasen pro Woche |
| **Berufsbegleitend** | 20 Wochen | 10 Lektionen/Woche | 3× abends à 2 Lektionen + Samstag 4 Lektionen |
| **Entspanntes Selbststudium** | 34 Wochen | 6 Lektionen/Woche | 3 Abende à 2 Lektionen (90 Min.) + 15 Min. Flashcards |

> **Meilenstein-Checkliste für unterwegs**:
> `L001–L002` (**CP-0** Baseline) → `L041–L042` (**CP-1**, Ziel 30–40 %) → `L081–L082` (**CP-2**, Ziel 50–60 %) → `L121–L122` (**CP-3**, Ziel ≥ 65 %) → `L161–L162` (**CP-4**, Ziel 75–85 %) → `L179–L198` (6 Clinics + 2 Mock Exams ≥ 75 %) → `L199–L200` (**CP-5**, Ziel ≥ 85 %).

---

## Austausch & Peer-Review (Community of Inquiry)

Auch im reinen Selbststudium musst du nicht allein lernen:

1. **GitHub Discussions & Fragen:** Nutze [GitHub Discussions im Repository](https://github.com/chatelao/sql-schulung/discussions), um Fragen zu einzelnen Lektionen (`L001–L200`, `A001–A060`, `D001–D030`) oder `ORA-`-Fehlermeldungen zu stellen.
2. **Peer-Review für Checkpoint Part B:** Teile deine 3 SQL-Lösungen aus Part B nach einem Checkpoint mit einer Lernpartnerin / einem Lernpartner (oder in Discussions) und bewertet eure Queries gegenseitig anhand der [4-Kriterien-Rubrik (0–8 Punkte)](../checkpoints/benchmark-guide.md#bewertungsrubrik-fur-offene-sql-aufgaben-part-b-max-8-punkte-je-task).
3. **Versions-Hinweis (`26ai` / `23ai Free`):** Alle Erklärungen und Handbuch-Links verweisen auf die aktuelle **Oracle AI Database 26ai** Referenz und sind zu 100 % kompatibel mit **Oracle Database 23ai Free** (Docker) und **Oracle FreeSQL**.
