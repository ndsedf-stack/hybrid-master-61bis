// ==================================================================
// HYBRID MASTER 61 - APP PRINCIPAL FINAL CORRIGÉ
// ==================================================================

console.log('🚀 app.js chargé - Version FINALE CORRIGÉE');

// ==================================================================
// IMPORTS
// ==================================================================
import programData from './program-data.js';
import { NavigationUI } from './ui/navigation-ui.js';
import { HomeRenderer } from './ui/home-renderer.js';
import { WorkoutRenderer } from './ui/workout-renderer.js';
import TimerManager from '../modules/timer-manager.js';

// ==================================================================
// CLASSE APP
// ==================================================================

class HybridMasterApp {
  constructor() {
    this.programData = programData;
    this.currentWeek = 1;
    this.currentView = 'home';
    this.selectedWorkout = null;
    
    this.navigationUI = new NavigationUI();
    this.homeRenderer = new HomeRenderer();
    this.workoutRenderer = new WorkoutRenderer();
    this.timerManager = new TimerManager();
  }

  async init() {
    try {
      this.showHome();
      this.setupEventListeners();
    } catch (error) {
      console.error('Erreur initialisation:', error);
      this.showError('Impossible de charger les données du programme');
    }
  }

  showHome() {
    try {
      const weekData = this.programData.getWeek(this.currentWeek);

      // Conversion en daysArray depuis dimanche/mardi/vendredi/maison
      const daysArray = [
        { 
          day: "Dimanche", 
          location: weekData.dimanche.name, 
          exercises: weekData.dimanche.exercises,
          duration: weekData.dimanche.duration,
          totalSets: weekData.dimanche.totalSets
        },
        { 
          day: "Mardi", 
          location: weekData.mardi.name, 
          exercises: weekData.mardi.exercises,
          duration: weekData.mardi.duration,
          totalSets: weekData.mardi.totalSets
        },
        { 
          day: "Vendredi", 
          location: weekData.vendredi.name, 
          exercises: weekData.vendredi.exercises,
          duration: weekData.vendredi.duration,
          totalSets: weekData.vendredi.totalSets
        },
        { 
          day: "Maison", 
          location: weekData.maison.name, 
          exercises: weekData.maison.exercises,
          duration: weekData.maison.duration,
          totalSets: weekData.maison.totalSets
        }
      ];

      const appElement = document.getElementById('app');
      appElement.innerHTML = this.navigationUI.render(this.currentWeek);
      
      const contentElement = document.getElementById('workout-content');
      contentElement.innerHTML = this.homeRenderer.render(daysArray);
      
      this.currentView = 'home';
      
    } catch (error) {
      console.error('Erreur affichage HOME:', error);
      this.showError('Impossible d\'afficher la page d\'accueil');
    }
  }

  showWorkout(dayName) {
    try {
      const weekData = this.programData.getWeek(this.currentWeek);
      
      const daysArray = [
        { day: "Dimanche", location: weekData.dimanche.name, exercises: weekData.dimanche.exercises },
        { day: "Mardi", location: weekData.mardi.name, exercises: weekData.mardi.exercises },
        { day: "Vendredi", location: weekData.vendredi.name, exercises: weekData.vendredi.exercises },
        { day: "Maison", location: weekData.maison.name, exercises: weekData.maison.exercises }
      ];

      const workout = daysArray.find(d => d.day === dayName);
      
      if (!workout) {
        throw new Error(`Séance "${dayName}" introuvable`);
      }

      this.selectedWorkout = workout;
      
      const appElement = document.getElementById('app');
      appElement.innerHTML = this.workoutRenderer.render(workout, this.currentWeek);
      
      this.currentView = 'workout';
      
    } catch (error) {
      console.error('Erreur affichage séance:', error);
      this.showError('Impossible d\'afficher la séance');
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Click sur une carte de workout
      if (e.target.closest('[data-day]')) {
        const dayName = e.target.closest('[data-day]').dataset.day;
        this.showWorkout(dayName);
      }
      
      // Bouton retour
      if (e.target.id === 'back-home') {
        this.showHome();
      }
      
      // Navigation semaines
      if (e.target.id === 'prev-week') {
        if (this.currentWeek > 1) {
          this.currentWeek--;
          this.showHome();
        }
      }
      
      if (e.target.id === 'next-week') {
        if (this.currentWeek < 26) {
          this.currentWeek++;
          this.showHome();
        }
      }

      // Timer automatique sur checkbox
      if (e.target.type === 'checkbox' && e.target.closest('.set-item')) {
        const exerciseCard = e.target.closest('.exercise-card');
        const restTime = parseInt(exerciseCard.dataset.rest) || 90;
        this.timerManager.startTimer(restTime);
      }
    });
  }

  showError(message) {
    const appElement = document.getElementById('app');
    appElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #ff6b6b; margin-bottom: 10px;">Erreur</h2>
        <p style="color: #999; margin-bottom: 20px;">${message}</p>
        <button onclick="location.reload()" style="padding: 12px 24px; background: #ff6b6b; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
          🔄 Recharger la page
        </button>
      </div>
    `;
  }
}

// ==================================================================
// INITIALISATION
// ==================================================================

const app = new HybridMasterApp();
window.app = app;

app.init();
