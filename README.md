# Fuzzy-Logic Music Recommendation System

Ein browserbasiertes Musikempfehlungssystem mit einer selbst implementierten
**Mamdani-Fuzzy-Inferenz**. Die Anwendung verarbeitet vier unscharfe
Eingangsgrößen und leitet daraus ein passendes Musikgenre sowie ein empfohlenes
Tempo in BPM ab.

## Funktionsweise

| Eingabe | Wertebereich | Linguistische Terme |
|---|---:|---|
| Gesichtsausdruck | 0–100 | traurig, neutral, glücklich |
| Zuletzt gehörtes Tempo | 40–200 BPM | langsam, mittel, schnell |
| Energielevel | 0–100 | niedrig, mittel, hoch |
| Umgebungshelligkeit | 0–100 | dunkel, gedimmt, hell |

Die vier Eingaben besitzen jeweils drei linguistische Terme. Dadurch deckt die
Regelbasis alle **3⁴ = 81 Kombinationen** ab.

Die Auswertung erfolgt in vier Schritten:

1. Fuzzifizierung mit dreieckigen und trapezförmigen Zugehörigkeitsfunktionen
2. Regelauswertung mit dem MIN-Operator für UND-Verknüpfungen
3. MAX-Aggregation der Regelergebnisse
4. Defuzzifizierung nach der Schwerpunktmethode (Center of Area)

Als Ergebnis liefert die Anwendung:

- eines von fünf Musikgenres: Melancholic, Chill, Pop, Energetic oder Intense
- ein empfohlenes Tempo zwischen 60 und 180 BPM
- die aktivierten Regeln und ihre Aktivierungsgrade
- passende Titel über die öffentliche iTunes Search API oder lokale
  YouTube-Empfehlungen als Fallback

## Technische Merkmale

- Fuzzy-Engine vollständig in Vanilla JavaScript implementiert
- 81 IF-THEN-Regeln in einer transparenten Regelbasis
- 21 Zugehörigkeitsfunktionen für Eingaben und Ausgaben
- Visualisierung der Zugehörigkeitsgrade und aktiven Regeln
- responsive Benutzeroberfläche in HTML und CSS
- kein Backend und kein API-Schlüssel erforderlich

> Hinweis: Gesichtsausdruck, Energie und Helligkeit werden über
> Benutzeroberflächen eingegeben; die Anwendung führt keine Kamera- oder
> Sensormessung durch.

## Projektstruktur

```text
.
├── index.html
├── css/
│   ├── styles.css
│   └── animations.css
└── js/
    ├── fuzzy/
    │   ├── membership.js
    │   ├── rules.js
    │   ├── defuzzifier.js
    │   └── engine.js
    ├── inputs/
    ├── outputs/
    ├── dashboard.js
    └── app.js
```

## Lokal starten

Das Projekt benötigt keine Installation. Es kann direkt über `index.html`
geöffnet oder mit einem lokalen Webserver gestartet werden:

```bash
python -m http.server 8000
```

Danach im Browser `http://localhost:8000` aufrufen.

## Technologien

JavaScript · HTML5 · CSS3 · Mamdani-Fuzzy-Logik · iTunes Search API

## Lizenz

Dieses Projekt steht unter der im Repository enthaltenen Lizenz.
