import ProgramData from './program-data.js';
import WorkoutRenderer from './ui/workout-renderer.js';
import TimerManager from './modules/timer-manager.js';
import { HomeRenderer } from './modules/home-renderer.js'; // ✅ import corrigé

class App {
  constructor() {
    this.renderer = new WorkoutRenderer();
    this.timer = new TimerManager();
    this.weekNumber = 1;
    this.dayName = 'dimanche';
    this.home = new HomeRenderer('homeRoot'); // ✅ initialisation accueil
  }

  async init() {
    console.log('🚀 Initialisation Hybrid Master 61...');
    this.renderer.init();
    this.timer.init();
    this.renderer.timerManager = this.timer;

    this.home.render(this.weekNumber); // ✅ affiche les séances cliquables
    this.renderWorkout();
    this.attachEvents();

    console.log('✅ Application prête !');
  }

  renderWorkout() {
    const week = ProgramData.getWeek(this.weekNumber);
    const workoutDay = ProgramData.getWorkout(this.weekNumber, this.dayName);
    workoutDay.name = this.capitalize(this.dayName);
    workoutDay.muscles = this.extractMuscles(workoutDay.exercises);
    console.log('📦 Séance chargée :', workoutDay);
    this.renderer.render(workoutDay, week);

    const label = document.getElementById('current-week-label');
    if (label) label.textContent = `Semaine ${this.weekNumber}`;
  }

  attachEvents() {
    document.getElementById('nav-prev-week')?.addEventListener('click', () => {
      if (this.weekNumber > 1) {
        this.weekNumber--;
        this.home.render(this.weekNumber); // ✅ met à jour l’accueil
        this.renderWorkout();
      }
    });

    document.getElementById('nav-next-week')?.addEventListener('click', () => {
      if (this.weekNumber < 26) {
        this.weekNumber++;
        this.home.render(this.weekNumber); // ✅ met à jour l’accueil
        this.renderWorkout();
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.serie-check');
      if (!btn) return;

      const exerciseId = btn.dataset.exerciseId;
      const setNumber = parseInt(btn.dataset.setNumber);
      console.log(`✅ Série cochée : ${exerciseId} - Set ${setNumber}`);

      const serieItem = btn.closest('.serie-item');
      if (serieItem) {
        serieItem.classList.add('completed');
      }

      btn.querySelector('.check-icon').textContent = '✓';
      btn.disabled = true;

      const exercise = this.findExerciseById(exerciseId);
      if (exercise) {
        const restTime = exercise.rest || 90;
        this.timer.start(restTime, exercise.name, setNumber);
      }
    });

    // ✅ écoute les boutons "Voir la séance" depuis l’accueil
    document.getElementById('homeRoot')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-day]');
      if (!btn) return;
      const day = btn.dataset.day;
      this.dayName = day;
      this.renderWorkout();
    });
  }

  findExerciseById(id) {
    const workout = ProgramData.getWorkout(this.weekNumber, this.dayName);
    return workout.exercises.find(ex => ex.id === id || ex.name === id);
  }

  extractMuscles(exercises) {
    const muscles = new Set();
    exercises.forEach(ex => {
      if (Array.isArray(ex.muscles)) ex.muscles.forEach(m => muscles.add(m));
    });
    return Array.from(muscles);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
