// ==================================================================
// APP.JS - VERSION STABLE SANS TIMERMANAGER
// ==================================================================

import programData from './program-data.js';
import { HomeRenderer } from './modules/home-renderer.js';
import { WorkoutRenderer } from './ui/workout-renderer.js';
import { NavigationUI } from './ui/navigation-ui.js';

class HybridMasterApp {
  constructor() {
    this.currentWeek = 1;
    this.currentView = 'home';
    this.currentDay = null;
    
    // Initialisation des modules UI (SANS TimerManager pour l'instant)
    this.navigationUI = new NavigationUI();
    this.homeRenderer = new HomeRenderer('content', this.handleDaySelected.bind(this));
    this.workoutRenderer = new WorkoutRenderer(
      document.getElementById('content'),
      this.handleBackToHome.bind(this)
    );
    
    console.log('✅ App initialisée (sans TimerManager)');
  }

  init() {
    console.log('🚀 Démarrage de l\'application...');
    
    try {
      // Test de chargement des données
      const week1 = programData.getWeek(1);
      if (!week1) {
        throw new Error('Données de la semaine 1 introuvables');
      }
      
      console.log('✅ Données chargées:', week1);
      
      // Configuration de la navigation
      this.setupNavigation();
      
      // Affichage de la page d'accueil
      this.showHome();
      
      console.log('✅ Application prête !');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      this.showError('Impossible de charger les données du programme');
    }
  }

  setupNavigation() {
    // Boutons navigation semaines
    const prevBtn = document.getElementById('nav-prev');
    const nextBtn = document.getElementById('nav-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentWeek > 1) {
          this.currentWeek--;
          this.navigationUI.setWeek(this.currentWeek);
          if (this.currentView === 'home') {
            this.showHome();
          } else if (this.currentDay) {
            this.showWorkout(this.currentDay);
          }
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentWeek < 26) {
          this.currentWeek++;
          this.navigationUI.setWeek(this.currentWeek);
          if (this.currentView === 'home') {
            this.showHome();
          } else if (this.currentDay) {
            this.showWorkout(this.currentDay);
          }
        }
      });
    }
  }

  showHome() {
    console.log('🏠 Affichage de la page d\'accueil');
    
    try {
      this.currentView = 'home';
      this.currentDay = null;
      
      // Récupération des données de la semaine
      const weekData = programData.getWeek(this.currentWeek);
      
      if (!weekData) {
        throw new Error(`Semaine ${this.currentWeek} introuvable`);
      }

      // Mise à jour de l'affichage de la semaine
      this.navigationUI.setWeek(this.currentWeek);
      
      // Préparation des données pour le HomeRenderer
      const daysArray = ['dimanche', 'mardi', 'vendredi', 'maison'].map(day => {
        const workout = weekData[day];
        return {
          day: day.charAt(0).toUpperCase() + day.slice(1),
          data: workout
        };
      });

      // Rendu de la page d'accueil
      const contentElement = document.getElementById('content');
      if (!contentElement) {
        throw new Error('Élément #content introuvable');
      }

      // Format attendu par HomeRenderer
      const formattedWeekData = {
        weekNumber: this.currentWeek,
        block: weekData.block,
        technique: weekData.technique,
        isDeload: weekData.isDeload,
        days: daysArray
      };

      contentElement.innerHTML = this.homeRenderer.render(contentElement, formattedWeekData);
      
      // Attache les écouteurs d'événements aux cartes
      this.attachHomeEventListeners();
      
      console.log('✅ Page d\'accueil affichée');
      
    } catch (error) {
      console.error('❌ Erreur affichage HOME:', error);
      this.showError(`Erreur lors de l'affichage de la page d'accueil: ${error.message}`);
    }
  }

  attachHomeEventListeners() {
    // Écouteurs pour les boutons "COMMENCER" des cartes
    const startButtons = document.querySelectorAll('.workout-card-start');
    startButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.workout-card');
        const day = card?.dataset.day;
        if (day) {
          this.handleDaySelected(day.toLowerCase());
        }
      });
    });
  }

  handleDaySelected(day) {
    console.log(`📅 Jour sélectionné: ${day}`);
    this.showWorkout(day);
  }

  showWorkout(day) {
    console.log(`💪 Affichage du workout: ${day}`);
    
    try {
      this.currentView = 'workout';
      this.currentDay = day;
      
      // Récupération des données du workout
      const workout = programData.getWorkout(this.currentWeek, day);
      
      if (!workout) {
        throw new Error(`Workout introuvable pour ${day} semaine ${this.currentWeek}`);
      }

      // Mise à jour de la navigation
      this.navigationUI.setDay(day);
      
      // Rendu du workout avec le WorkoutRenderer
      this.workoutRenderer.render(workout, this.currentWeek);
      
      console.log('✅ Workout affiché');
      
    } catch (error) {
      console.error('❌ Erreur affichage WORKOUT:', error);
      this.showError(`Erreur lors de l'affichage du workout: ${error.message}`);
    }
  }

  handleBackToHome() {
    console.log('🔙 Retour à l\'accueil');
    this.showHome();
  }

  showError(message) {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-message" style="padding: 20px; text-align: center;">
          <h2 style="color: #ff4444;">❌ Erreur</h2>
          <p style="color: #fff; margin: 20px 0;">${message}</p>
          <button onclick="location.reload()" class="btn-primary" style="padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 5px;">
            🔄 Recharger la page
          </button>
        </div>
      `;
    }
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM chargé, initialisation de l\'app...');
  
  try {
    const app = new HybridMasterApp();
    app.init();
    
    // Exposition globale pour le debug
    window.app = app;
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #ff0000;">❌ Erreur fatale</h2>
          <p style="color: #fff;">${error.message}</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 5px;">
            🔄 Recharger
          </button>
        </div>
      `;
    }
  }
});
