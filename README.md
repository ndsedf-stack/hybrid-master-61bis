markdown
# 📚 HYBRID MASTER 61 - GUIDE COMPLET D'ARCHITECTURE

Document pour comprendre **toute l'application**, où modifier quoi, et comment tout est lié.

---

## 🏗️ ARCHITECTURE MODULAIRE - VUE D'ENSEMBLE

hybrid-master-61/ ├── index.html # Point d'entrée HTML ├── styles/ # CSS modulaire (ordre = important!) │ ├── 01-reset.css # Reset CSS navigateur │ ├── 02-variables.css # Variables CSS (couleurs, tailles) │ ├── 03-base.css # Styles de base (body, html) │ ├── 04-layout.css # Layout général (header, containers) │ ├── 05-components.css # ⭐ Cartes exercices, en-têtes │ ├── 06-series.css # ⭐ Lignes de séries + validation │ ├── 07-timer.css # ⭐ Widget timer (NOUVEAU/AMÉLIORÉ) │ ├── 08-responsive.css # Media queries mobile │ └── 09-statistics.css # Stats (futur) ├── scripts/ │ ├── app.js # ⭐ POINT D'ENTRÉE PRINCIPAL │ ├── program-data.js # 📊 DONNÉES PROGRAMME MUSCU │ ├── modules/ │ │ ├── timer-manager.js # ⭐ TIMER (AMÉLIORÉ) │ │ ├── statistics-engine.js # Stats (futur) │ │ └── workout-session.js # Session tracking (futur) │ ├── ui/ │ │ ├── workout-renderer.js # ⭐ RENDU exercices/séries │ │ ├── navigation-ui.js # Navigation (futur) │ │ └── modal-manager.js # Modals (futur) │ └── storage/ │ ├── local-storage.js # Sauvegarde locale (futur) │ └── export-import.js # Export/Import (futur)

Code

---

## 📋 FICHIERS CLÉS - CE QU'ILS FONT

### 1️⃣ `program-data.js` – LES DONNÉES DU PROGRAMME

Contient toutes les données du programme muscu (26 semaines, 4 jours/semaine).

```js
const programData = {
  info: { name: "Hybrid Master 61", weeks: 26, author: "Vous", startDate: "2025-01-01" },
  weeks: [
    {
      weekNumber: 1,
      block: 1,
      technique: "Tempo 3-1-2",
      isDeload: false,
      workouts: {
        dimanche: { name: "Full Body A", exercises: [...] },
        mardi: { name: "Full Body B", exercises: [...] },
        vendredi: { name: "Full Body C", exercises: [...] },
        maison: { name: "Maison", exercises: [...] }
      }
    },
    // ...
  ]
};
Structure d’un exercice :
js
{
  id: "trap-bar-deadlift",
  name: "Trap Bar Deadlift",
  type: "strength",
  category: "compound",
  muscles: ["dos", "jambes"],
  sets: 5,
  reps: "6-8",
  weight: 75,
  rpe: "6-7",
  rest: 120,
  tempo: "3-1-2",
  notes: "Garder le dos droit",
  progression: { from: 70, to: 80 },
  superset: true
}
2️⃣ app.js – CHEF D’ORCHESTRE DE L’APPLICATION
Initialise l’application, gère la navigation, coordonne les modules.

js
const AppState = {
  currentWeek: 1,
  currentDay: 'dimanche',
  currentWorkout: null,
  completedSets: new Set(),
  timerManager: null,
  workoutRenderer: null
};
3️⃣ workout-renderer.js – AFFICHAGE DES EXERCICES
Transforme les données en HTML et gère les interactions.

render(workoutDay, week)

renderExercise(exercise, index)

renderSeries(exercise, exerciseId)

attachSeriesListeners()

✅ Validation d’une série :

Toggle .validated

Log console

Déclenche le timer via AppState.timerManager.start(restSeconds)

4️⃣ timer-manager.js – GESTION DU TIMER
Gère le compte à rebours entre les séries.

js
class TimerManager {
  start(seconds) { ... }
  pause() { ... }
  resume() { ... }
  stop() { ... }
  updateDisplay() { ... }
}
🔧 À améliorer :

addTime(seconds)

skip()

reset()

showNotification()

Progress bar circulaire

Affichage série/exercice

Son/vibration

🎨 STYLES CSS CLÉS
05-components.css – Cartes exercices
.exercise-card, .exercise-header, .param-item

06-series.css – Lignes de séries
.serie-row.validated → bordure verte, glow

07-timer.css – Widget timer
.timer-widget, .timer-display, .timer-controls

🔗 FLUX DE DONNÉES
Chargement d’un workout :
Sélection semaine/jour

loadWorkout(week, day)

getWorkout() → render()

renderSeries() → attachSeriesListeners()

Validation d’une série :
Clic bouton ✓

Toggle .validated

Récupération rest

timerManager.start(restSeconds)

🚀 AMÉLIORATIONS EN COURS
✅ Architecture modulaire ES6

✅ Affichage exercices/séries

✅ Validation visuelle

✅ Timer basique

🚧 Timer enrichi (v1.1)

📅 Statistiques, export, PWA (v2.0)

🛠️ GUIDE DE MODIFICATION RAPIDE
Changer un poids :

js
programData.weeks[0].workouts.dimanche.exercises[0].weight = 80;
Changer le repos :

js
ex.rest = 180;
Changer couleur validation :

css
.serie-row.validated { border-color: #2196F3; }
📝 CHANGELOG
v1.0 : Base stable, affichage, validation

v1.1 : Timer enrichi, design circulaire

v2.0 : Sauvegarde, stats, export, PWA
