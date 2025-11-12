// ==================================================================
// APP.JS - VERSION DEBUG VISUEL COMPLET
// ==================================================================

// Système de log visuel
const debugLog = {
  messages: [],
  container: null,
  
  init() {
    // Création du panneau de debug
    this.container = document.createElement('div');
    this.container.id = 'debug-panel';
    this.container.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background: #1a1a1a;
      color: #00ff00;
      padding: 10px;
      font-family: monospace;
      font-size: 11px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10000;
      border-bottom: 2px solid #00ff00;
    `;
    document.body.appendChild(this.container);
    this.log('🟢 Panneau de debug initialisé');
  },
  
  log(message, type = 'info') {
    const colors = {
      info: '#00ff00',
      success: '#00ff00',
      error: '#ff0000',
      warning: '#ffaa00'
    };
    
    const time = new Date().toLocaleTimeString();
    const fullMessage = `[${time}] ${message}`;
    
    console.log(fullMessage);
    this.messages.push({ message: fullMessage, type });
    
    if (this.container) {
      const line = document.createElement('div');
      line.style.color = colors[type] || colors.info;
      line.textContent = fullMessage;
      this.container.appendChild(line);
      this.container.scrollTop = this.container.scrollHeight;
    }
  },
  
  clear() {
    this.messages = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};

// Import avec gestion d'erreur
let programData, HomeRenderer, WorkoutRenderer, NavigationUI, TimerManager;

debugLog.init();
debugLog.log('🚀 Démarrage du chargement des modules...');

// Chargement des modules
Promise.all([
  import('./program-data.js').then(m => {
    programData = m.default;
    debugLog.log('✅ program-data.js chargé');
    return m;
  }).catch(e => {
    debugLog.log(`❌ Erreur program-data.js: ${e.message}`, 'error');
    throw e;
  }),
  
  import('./modules/home-renderer.js').then(m => {
    HomeRenderer = m.HomeRenderer;
    debugLog.log('✅ home-renderer.js chargé depuis modules/');
    return m;
  }).catch(e => {
    debugLog.log(`❌ Erreur home-renderer.js: ${e.message}`, 'error');
    throw e;
  }),
  
  import('./ui/workout-renderer.js').then(m => {
    WorkoutRenderer = m.WorkoutRenderer;
    debugLog.log('✅ workout-renderer.js chargé depuis ui/');
    return m;
  }).catch(e => {
    debugLog.log(`❌ Erreur workout-renderer.js: ${e.message}`, 'error');
    throw e;
  }),
  
  import('./ui/navigation-ui.js').then(m => {
    NavigationUI = m.NavigationUI;
    debugLog.log('✅ navigation-ui.js chargé depuis ui/');
    return m;
  }).catch(e => {
    debugLog.log(`❌ Erreur navigation-ui.js: ${e.message}`, 'error');
    throw e;
  }),
  
  import('./modules/timer-manager.js').then(m => {
    TimerManager = m.TimerManager;
    debugLog.log('✅ timer-manager.js chargé depuis modules/');
    return m;
  }).catch(e => {
    debugLog.log(`❌ Erreur timer-manager.js: ${e.message}`, 'error');
    throw e;
  })
])
.then(() => {
  debugLog.log('✅ TOUS LES MODULES CHARGÉS', 'success');
  initApp();
})
.catch(error => {
  debugLog.log(`❌ ERREUR FATALE DE CHARGEMENT: ${error.message}`, 'error');
  debugLog.log(`Stack: ${error.stack}`, 'error');
  showFatalError(error);
});

function showFatalError(error) {
  const content = document.getElementById('content');
  if (content) {
    content.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2 style="color: #ff0000;">❌ Erreur de chargement</h2>
        <p style="color: #fff;">${error.message}</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Vérifiez le panneau de debug en haut de la page
        </p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 5px;">
          🔄 Recharger
        </button>
      </div>
    `;
  }
}

function initApp() {
  debugLog.log('🎬 Initialisation de l\'application...');
  
  class HybridMasterApp {
    constructor() {
      debugLog.log('🏗️ Construction de HybridMasterApp...');
      
      this.currentWeek = 1;
      this.currentView = 'home';
      this.currentDay = null;
      
      try {
        debugLog.log('📦 Création des instances de modules...');
        
        this.navigationUI = new NavigationUI();
        debugLog.log('✅ NavigationUI créé');
        
        this.homeRenderer = new HomeRenderer('content', this.handleDaySelected.bind(this));
        debugLog.log('✅ HomeRenderer créé');
        
        this.workoutRenderer = new WorkoutRenderer(
          document.getElementById('content'),
          this.handleBackToHome.bind(this)
        );
        debugLog.log('✅ WorkoutRenderer créé');
        
        this.timerManager = new TimerManager();
        debugLog.log('✅ TimerManager créé');
        
        debugLog.log('✅ App construite avec succès', 'success');
      } catch (error) {
        debugLog.log(`❌ Erreur construction: ${error.message}`, 'error');
        throw error;
      }
    }

    init() {
      debugLog.log('🚀 Méthode init() appelée...');
      
      try {
        // Test de chargement des données
        debugLog.log('📊 Test de chargement des données...');
        const week1 = programData.getWeek(1);
        
        if (!week1) {
          throw new Error('programData.getWeek(1) retourne null/undefined');
        }
        
        debugLog.log(`✅ Données semaine 1: ${JSON.stringify(Object.keys(week1))}`, 'success');
        
        // Configuration de la navigation
        debugLog.log('⚙️ Configuration de la navigation...');
        this.setupNavigation();
        debugLog.log('✅ Navigation configurée');
        
        // Affichage de la page d'accueil
        debugLog.log('🏠 Affichage de la page d\'accueil...');
        this.showHome();
        
        debugLog.log('✅✅✅ APPLICATION PRÊTE !', 'success');
        
      } catch (error) {
        debugLog.log(`❌ Erreur init(): ${error.message}`, 'error');
        debugLog.log(`Stack: ${error.stack}`, 'error');
        this.showError(`Impossible de charger: ${error.message}`);
      }
    }

    setupNavigation() {
      const prevBtn = document.getElementById('nav-prev');
      const nextBtn = document.getElementById('nav-next');
      
      if (!prevBtn || !nextBtn) {
        debugLog.log('⚠️ Boutons navigation non trouvés', 'warning');
        return;
      }
      
      prevBtn.addEventListener('click', () => {
        if (this.currentWeek > 1) {
          this.currentWeek--;
          debugLog.log(`◀️ Semaine précédente: ${this.currentWeek}`);
          this.navigationUI.setWeek(this.currentWeek);
          if (this.currentView === 'home') {
            this.showHome();
          } else if (this.currentDay) {
            this.showWorkout(this.currentDay);
          }
        }
      });

      nextBtn.addEventListener('click', () => {
        if (this.currentWeek < 26) {
          this.currentWeek++;
          debugLog.log(`▶️ Semaine suivante: ${this.currentWeek}`);
          this.navigationUI.setWeek(this.currentWeek);
          if (this.currentView === 'home') {
            this.showHome();
          } else if (this.currentDay) {
            this.showWorkout(this.currentDay);
          }
        }
      });
    }

    showHome() {
      debugLog.log('🏠 showHome() appelée...');
      
      try {
        this.currentView = 'home';
        this.currentDay = null;
        
        debugLog.log(`📊 Récupération semaine ${this.currentWeek}...`);
        const weekData = programData.getWeek(this.currentWeek);
        
        if (!weekData) {
          throw new Error(`getWeek(${this.currentWeek}) retourne null`);
        }
        
        debugLog.log(`✅ Données reçues: ${JSON.stringify(Object.keys(weekData))}`);
        
        // Mise à jour navigation
        this.navigationUI.setWeek(this.currentWeek);
        debugLog.log('✅ Navigation mise à jour');
        
        // Préparation des jours
        const days = ['dimanche', 'mardi', 'vendredi', 'maison'];
        debugLog.log(`📅 Préparation de ${days.length} jours...`);
        
        const daysArray = days.map(day => {
          const workout = weekData[day];
          if (!workout) {
            debugLog.log(`⚠️ Pas de workout pour ${day}`, 'warning');
          }
          return {
            day: day.charAt(0).toUpperCase() + day.slice(1),
            data: workout
          };
        });
        
        debugLog.log(`✅ ${daysArray.length} jours préparés`);
        
        // Format pour HomeRenderer
        const formattedWeekData = {
          weekNumber: this.currentWeek,
          block: weekData.block,
          technique: weekData.technique,
          isDeload: weekData.isDeload,
          days: daysArray
        };
        
        debugLog.log('📝 Appel de homeRenderer.render()...');
        
        const contentElement = document.getElementById('content');
        if (!contentElement) {
          throw new Error('Élément #content introuvable');
        }
        
        const html = this.homeRenderer.render(contentElement, formattedWeekData);
        debugLog.log(`✅ HTML généré (${html.length} caractères)`);
        
        contentElement.innerHTML = html;
        debugLog.log('✅ HTML injecté dans #content');
        
        // Attache événements
        this.attachHomeEventListeners();
        debugLog.log('✅ Événements attachés');
        
        debugLog.log('✅✅ PAGE ACCUEIL AFFICHÉE', 'success');
        
      } catch (error) {
        debugLog.log(`❌ Erreur showHome(): ${error.message}`, 'error');
        debugLog.log(`Stack: ${error.stack}`, 'error');
        this.showError(`Erreur affichage: ${error.message}`);
      }
    }

    attachHomeEventListeners() {
      const startButtons = document.querySelectorAll('.workout-card-start');
      debugLog.log(`🔘 ${startButtons.length} boutons COMMENCER trouvés`);
      
      startButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
          const card = e.target.closest('.workout-card');
          const day = card?.dataset.day;
          debugLog.log(`🎯 Clic sur carte ${index + 1}, jour: ${day}`);
          if (day) {
            this.handleDaySelected(day.toLowerCase());
          }
        });
      });
    }

    handleDaySelected(day) {
      debugLog.log(`📅 Jour sélectionné: ${day}`);
      this.showWorkout(day);
    }

    showWorkout(day) {
      debugLog.log(`💪 showWorkout(${day}) appelée...`);
      
      try {
        this.currentView = 'workout';
        this.currentDay = day;
        
        const workout = programData.getWorkout(this.currentWeek, day);
        
        if (!workout) {
          throw new Error(`getWorkout(${this.currentWeek}, ${day}) retourne null`);
        }
        
        debugLog.log(`✅ Workout récupéré: ${workout.name}`);
        
        this.navigationUI.setDay(day);
        this.workoutRenderer.render(workout, this.currentWeek);
        
        debugLog.log('✅✅ WORKOUT AFFICHÉ', 'success');
        
      } catch (error) {
        debugLog.log(`❌ Erreur showWorkout(): ${error.message}`, 'error');
        this.showError(`Erreur workout: ${error.message}`);
      }
    }

    handleBackToHome() {
      debugLog.log('🔙 Retour accueil...');
      if (this.timerManager) {
        this.timerManager.stop();
      }
      this.showHome();
    }

    showError(message) {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.innerHTML = `
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #ff0000;">❌ Erreur</h2>
            <p style="color: #fff;">${message}</p>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              Consultez le panneau de debug en haut
            </p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 5px;">
              🔄 Recharger
            </button>
          </div>
        `;
      }
    }
  }

  // Initialisation au chargement du DOM
  if (document.readyState === 'loading') {
    debugLog.log('⏳ En attente du DOM...');
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    debugLog.log('✅ DOM déjà chargé');
    startApp();
  }

  function startApp() {
    debugLog.log('📱 Démarrage de l\'application...');
    try {
      const app = new HybridMasterApp();
      app.init();
      window.app = app;
      debugLog.log('✅ App exposée dans window.app', 'success');
    } catch (error) {
      debugLog.log(`❌ Erreur startApp(): ${error.message}`, 'error');
      showFatalError(error);
    }
  }
}
