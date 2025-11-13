// ═══════════════════════════════════════════════════════════
// 💎 HYBRID MASTER 61 - INTERACTIVE FEATURES V2 COMPATIBLE
// ═══════════════════════════════════════════════════════════

class WorkoutInteractive {
  constructor() {
    this.timers = new Map();
    this.supersetStates = new Map();
  }

  init() {
    console.log('💪 Initialisation WorkoutInteractive...');
    this.initEditableStats();
    this.initTimers();
    this.initCheckboxes();
    this.initSupersetTimers();
    console.log('✅ WorkoutInteractive prêt');
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📝 STATS MODIFIABLES (poids, reps, repos)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initEditableStats() {
    // Boutons +/-
    document.querySelectorAll('.stat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleStatButton(btn);
      });
    });

    // Inputs
    document.querySelectorAll('.stat-value[type="number"]').forEach(input => {
      input.addEventListener('change', () => {
        this.saveStatValue(input);
      });

      input.addEventListener('focus', () => {
        input.select();
      });
    });
  }

  handleStatButton(btn) {
    const group = btn.closest('.stat-value-group');
    const input = group.querySelector('.stat-value');
    const type = btn.dataset.type;
    const action = btn.classList.contains('stat-plus') ? 'increase' : 'decrease';

    let value = parseFloat(input.value) || 0;
    const step = parseFloat(input.step) || 1;

    if (action === 'increase') {
      value += step;
    } else {
      value = Math.max(0, value - step);
    }

    input.value = type === 'weight' ? value.toFixed(1) : Math.round(value);
    
    this.saveStatValue(input);
    this.animateChange(btn);
  }

  saveStatValue(input) {
    const exerciseCard = input.closest('.exercise-card');
    if (!exerciseCard) return;

    const exerciseId = exerciseCard.dataset.exerciseId;
    const type = input.dataset.type;
    const value = input.value;

    const key = `stat_${exerciseId}_${type}`;
    localStorage.setItem(key, value);
    
    console.log(`💾 ${key} = ${value}`);
  }

  animateChange(element) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏱️ TIMERS CIRCULAIRES ANIMÉS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initTimers() {
    // Timers individuels dans les sets (hors superset)
    document.querySelectorAll('.set-card .timer-circular').forEach(timer => {
      this.setupTimer(timer, 'individual');
    });
  }

  setupTimer(timerEl, type = 'individual') {
    const duration = parseInt(timerEl.dataset.duration) || 60;
    const timerId = `timer_${Date.now()}_${Math.random()}`;

    timerEl.dataset.timerId = timerId;

    const timer = {
      id: timerId,
      element: timerEl,
      duration,
      remaining: duration,
      isActive: false,
      interval: null,
      type
    };

    this.timers.set(timerId, timer);

    // Click pour démarrer/pause
    timerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleTimer(timerId);
    });
  }

  toggleTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    if (timer.isActive) {
      this.pauseTimer(timerId);
    } else {
      this.startTimer(timerId);
    }
  }

  startTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer || timer.isActive) return;

    timer.isActive = true;
    timer.element.classList.add('active');

    const progressCircle = timer.element.querySelector('.timer-progress');
    const textValue = timer.element.querySelector('.timer-value');
    
    if (!progressCircle || !textValue) return;

    const radius = timer.type === 'superset' ? 52 : 35;
    const circumference = 2 * Math.PI * radius;

    timer.interval = setInterval(() => {
      timer.remaining--;

      // Update texte
      textValue.textContent = this.formatTime(timer.remaining);

      // Update cercle
      const progress = timer.remaining / timer.duration;
      const offset = circumference * (1 - progress);
      progressCircle.style.strokeDashoffset = offset;

      // Alerte rouge < 10s
      if (timer.remaining <= 10) {
        progressCircle.style.stroke = '#FF453A';
        textValue.style.color = '#FF453A';
      }

      // Fin
      if (timer.remaining <= 0) {
        this.finishTimer(timerId);
      }
    }, 1000);

    console.log(`⏱️ Timer démarré: ${timerId}`);
  }

  pauseTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    timer.isActive = false;
    timer.element.classList.remove('active');

    if (timer.interval) {
      clearInterval(timer.interval);
      timer.interval = null;
    }

    console.log(`⏸️ Timer en pause: ${timerId}`);
  }

  finishTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    this.pauseTimer(timerId);

    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Animation
    timer.element.classList.add('finished');
    
    // Notification
    this.showNotification('⏰ Repos terminé !');

    // Reset après 2s
    setTimeout(() => {
      timer.element.classList.remove('finished');
      this.resetTimer(timerId);
    }, 2000);
  }

  resetTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    timer.remaining = timer.duration;
    timer.isActive = false;

    const progressCircle = timer.element.querySelector('.timer-progress');
    const textValue = timer.element.querySelector('.timer-value');

    if (progressCircle && textValue) {
      textValue.textContent = this.formatTime(timer.duration);
      progressCircle.style.strokeDashoffset = '0';
      progressCircle.style.stroke = 'url(#timerGradient)';
      textValue.style.color = '#ffffff';
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✓ CHECKBOXES - VALIDATION DES SÉRIES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initCheckboxes() {
    document.querySelectorAll('.set-check').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCheck(btn);
      });
    });
  }

  toggleCheck(button) {
    const setCard = button.closest('.set-card');
    if (!setCard) return;

    const isChecked = setCard.classList.contains('completed');

    if (isChecked) {
      // Décocher
      setCard.classList.remove('completed');
      button.querySelector('.check-icon').textContent = '';
    } else {
      // Cocher
      setCard.classList.add('completed');
      button.querySelector('.check-icon').textContent = '✓';

      // Animation
      this.animateCompletion(setCard);

      // Démarrer timer (si pas dans superset)
      const timer = setCard.querySelector('.timer-circular');
      if (timer && timer.dataset.timerId) {
        setTimeout(() => {
          this.startTimer(timer.dataset.timerId);
        }, 500);
      }

      // Check si c'est dans un superset
      const supersetGroup = setCard.closest('.superset-group');
      if (supersetGroup) {
        this.checkSupersetCompletion(supersetGroup);
      }
    }

    // Sauvegarder
    this.saveCheckState(setCard, !isChecked);
  }

  animateCompletion(setCard) {
    setCard.style.transform = 'scale(1.03)';
    setTimeout(() => {
      setCard.style.transform = 'scale(1)';
    }, 200);
  }

  saveCheckState(setCard, isChecked) {
    const setId = setCard.dataset.setId;
    if (!setId) return;

    localStorage.setItem(`check_${setId}`, isChecked);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔗 SUPERSET - TIMER UNIQUE POUR 2 EXERCICES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initSupersetTimers() {
    document.querySelectorAll('.superset-group').forEach(group => {
      const supersetTimer = group.querySelector('.superset-timer-wrapper .timer-circular');
      
      if (supersetTimer) {
        this.setupTimer(supersetTimer, 'superset');
        
        // Init state
        const groupId = `superset_${Date.now()}`;
        group.dataset.supersetId = groupId;
        
        this.supersetStates.set(groupId, {
          exercise1Complete: false,
          exercise2Complete: false,
          currentSet: 1
        });
      }
    });
  }

  checkSupersetCompletion(supersetGroup) {
    const groupId = supersetGroup.dataset.supersetId;
    if (!groupId) return;

    // Compter les sets complétés dans chaque exercice
    const exercises = supersetGroup.querySelectorAll('.superset-item');
    if (exercises.length !== 2) return;

    const currentSetNumber = this.getCurrentSetNumber(supersetGroup);
    
    const ex1Sets = exercises[0].querySelectorAll('.set-card');
    const ex2Sets = exercises[1].querySelectorAll('.set-card');

    const ex1CurrentComplete = ex1Sets[currentSetNumber - 1]?.classList.contains('completed');
    const ex2CurrentComplete = ex2Sets[currentSetNumber - 1]?.classList.contains('completed');

    console.log(`🔗 Superset check: Ex1=${ex1CurrentComplete}, Ex2=${ex2CurrentComplete}`);

    // Si les 2 exercices de la série actuelle sont validés
    if (ex1CurrentComplete && ex2CurrentComplete) {
      console.log('✅ Superset série complète ! Démarrage timer...');
      
      // Démarrer le timer du superset
      const supersetTimer = supersetGroup.querySelector('.superset-timer-wrapper .timer-circular');
      if (supersetTimer && supersetTimer.dataset.timerId) {
        setTimeout(() => {
          this.startTimer(supersetTimer.dataset.timerId);
        }, 800);
      }

      // Reset les checkboxes après démarrage du timer
      setTimeout(() => {
        ex1Sets[currentSetNumber - 1]?.classList.remove('completed');
        ex2Sets[currentSetNumber - 1]?.classList.remove('completed');
        
        const check1 = ex1Sets[currentSetNumber - 1]?.querySelector('.check-icon');
        const check2 = ex2Sets[currentSetNumber - 1]?.querySelector('.check-icon');
        
        if (check1) check1.textContent = '';
        if (check2) check2.textContent = '';
      }, 1200);
    }
  }

  getCurrentSetNumber(supersetGroup) {
    // Déterminer quelle série est en cours
    const allSets = supersetGroup.querySelectorAll('.set-card');
    const totalSets = allSets.length / 2; // 2 exercices

    for (let i = 1; i <= totalSets; i++) {
      const setIndex = i - 1;
      const ex1Set = allSets[setIndex];
      const ex2Set = allSets[setIndex + totalSets];

      const ex1Complete = ex1Set?.classList.contains('completed');
      const ex2Complete = ex2Set?.classList.contains('completed');

      // Si l'un des deux n'est pas complété, c'est la série en cours
      if (!ex1Complete || !ex2Complete) {
        return i;
      }
    }

    return totalSets; // Dernière série
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📢 NOTIFICATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  showNotification(message) {
    // Notification native si autorisée
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hybrid Master 61', {
        body: message,
        icon: '/favicon.ico'
      });
    }

    // Toast UI
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(48, 209, 88, 0.95);
      backdrop-filter: blur(20px);
      color: white;
      padding: 16px 32px;
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      z-index: 10000;
      font-weight: 600;
      font-size: 15px;
      animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💾 SAUVEGARDE / CHARGEMENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  loadSavedData() {
    // Charger les checkboxes
    document.querySelectorAll('.set-card').forEach(setCard => {
      const setId = setCard.dataset.setId;
      if (!setId) return;

      const isChecked = localStorage.getItem(`check_${setId}`) === 'true';
      if (isChecked) {
        setCard.classList.add('completed');
        const checkIcon = setCard.querySelector('.check-icon');
        if (checkIcon) checkIcon.textContent = '✓';
      }
    });

    // Charger les stats
    document.querySelectorAll('.stat-value[type="number"]').forEach(input => {
      const exerciseCard = input.closest('.exercise-card');
      if (!exerciseCard) return;

      const exerciseId = exerciseCard.dataset.exerciseId;
      const type = input.dataset.type;
      const key = `stat_${exerciseId}_${type}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        input.value = saved;
      }
    });

    console.log('💾 Données chargées depuis localStorage');
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Permission notifications:', permission);
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 🚀 INITIALISATION GLOBALE
// ═══════════════════════════════════════════════════════════

let workoutApp = null;

// Auto-init quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorkoutApp);
} else {
  initWorkoutApp();
}

function initWorkoutApp() {
  workoutApp = new WorkoutInteractive();
  workoutApp.requestNotificationPermission();
  
  // Exposer globalement
  window.workoutApp = workoutApp;
  
  console.log('💪 Hybrid Master 61 - Interactive Mode Activé');
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkoutInteractive;
}

// ═══════════════════════════════════════════════════════════
// 🎨 STYLES CSS ANIMATIONS
// ═══════════════════════════════════════════════════════════

const styles = `
@keyframes slideUp {
  from { transform: translateX(-50%) translateY(20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateX(-50%) translateY(0); opacity: 1; }
  to { transform: translateX(-50%) translateY(20px); opacity: 0; }
}

.timer-circular.active .timer-progress {
  animation: timerPulse 1.5s ease-in-out infinite;
}

@keyframes timerPulse {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 159, 10, 0.6)); }
  50% { filter: drop-shadow(0 0 16px rgba(255, 159, 10, 0.9)); }
}

.timer-circular.finished {
  animation: timerBounce 0.6s ease;
}

@keyframes timerBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.set-card.completed {
  background: rgba(48, 209, 88, 0.1);
  border-color: rgba(48, 209, 88, 0.4);
}

.set-check .check-icon {
  transition: all 0.2s ease;
}

.set-card.completed .check-icon {
  color: #30D158;
  font-size: 18px;
}
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}
