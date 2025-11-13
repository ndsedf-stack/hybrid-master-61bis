// ═══════════════════════════════════════════════════════════
// 💎 HYBRID MASTER 61 - INTERACTIVE FEATURES
// ═══════════════════════════════════════════════════════════

class WorkoutInteractive {
  constructor() {
    this.timers = new Map();
    this.editableFields = new Map();
    this.init();
  }

  init() {
    this.initEditableStats();
    this.initTimers();
    this.initCheckboxes();
    this.initSupersetTimers();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📝 STATS MODIFIABLES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initEditableStats() {
    // Rendre tous les stats éditables
    document.querySelectorAll('.stat-value').forEach(stat => {
      this.makeEditable(stat);
    });
  }

  makeEditable(element) {
    const statItem = element.closest('.stat-item, .stat');
    const label = statItem.querySelector('.stat-label');
    const type = this.getStatType(label?.textContent);

    // Wrapper avec boutons +/-
    const wrapper = document.createElement('div');
    wrapper.className = 'editable-stat';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.value = element.textContent.replace(/[^\d.]/g, '');
    input.step = type === 'weight' ? '2.5' : '1';
    input.className = 'stat-value';

    // Boutons de contrôle
    const controls = document.createElement('div');
    controls.className = 'stat-controls';
    controls.innerHTML = `
      <button class="stat-btn" data-action="decrease">−</button>
      <button class="stat-btn" data-action="increase">+</button>
    `;

    wrapper.appendChild(input);
    wrapper.appendChild(controls);
    element.replaceWith(wrapper);

    // Events
    input.addEventListener('focus', () => {
      wrapper.classList.add('editing');
      input.select();
    });

    input.addEventListener('blur', () => {
      wrapper.classList.remove('editing');
      this.saveStatValue(input, type);
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });

    // Boutons +/-
    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('.stat-btn');
      if (!btn) return;

      const action = btn.dataset.action;
      const currentValue = parseFloat(input.value) || 0;
      const step = parseFloat(input.step);

      if (action === 'increase') {
        input.value = (currentValue + step).toFixed(1);
      } else if (action === 'decrease') {
        input.value = Math.max(0, currentValue - step).toFixed(1);
      }

      this.saveStatValue(input, type);
      this.animateChange(wrapper);
    });
  }

  getStatType(label) {
    if (!label) return 'other';
    const text = label.toLowerCase();
    if (text.includes('poids') || text.includes('kg')) return 'weight';
    if (text.includes('reps') || text.includes('répétitions')) return 'reps';
    if (text.includes('repos') || text.includes('temps')) return 'rest';
    return 'other';
  }

  saveStatValue(input, type) {
    const setCard = input.closest('.set-card, .set');
    const exerciseCard = input.closest('.exercise, .exercise-card');
    
    if (!setCard || !exerciseCard) return;

    const exerciseId = exerciseCard.dataset.exerciseId;
    const setId = setCard.dataset.setId;
    const value = parseFloat(input.value);

    // Sauvegarder dans localStorage
    const key = `workout_${exerciseId}_${setId}_${type}`;
    localStorage.setItem(key, value);

    console.log(`💾 Sauvegardé: ${key} = ${value}`);
  }

  animateChange(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏱️ TIMER CIRCULAIRE ANIMÉ
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initTimers() {
    document.querySelectorAll('.set-card, .set').forEach(setCard => {
      const restTime = parseInt(setCard.dataset.rest) || 60;
      this.createTimer(setCard, restTime);
    });
  }

  createTimer(setCard, duration) {
    const timerId = setCard.dataset.setId || `timer_${Date.now()}`;
    
    // Trouver ou créer le conteneur timer
    let timerContainer = setCard.querySelector('.timer-container');
    if (!timerContainer) {
      timerContainer = this.createTimerHTML(duration);
      setCard.appendChild(timerContainer);
    }

    const timer = {
      duration,
      remaining: duration,
      isActive: false,
      interval: null,
      container: timerContainer
    };

    this.timers.set(timerId, timer);

    // Event click pour démarrer/pause
    timerContainer.addEventListener('click', () => {
      this.toggleTimer(timerId);
    });
  }

  createTimerHTML(duration) {
    const container = document.createElement('div');
    container.className = 'timer-container';
    
    const radius = 52;
    const circumference = 2 * Math.PI * radius;

    container.innerHTML = `
      <div class="timer-circle">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FF9F0A;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFB340;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle class="timer-circle-bg" cx="60" cy="60" r="${radius}"></circle>
          <circle 
            class="timer-circle-progress" 
            cx="60" 
            cy="60" 
            r="${radius}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="0"
          ></circle>
        </svg>
        <div class="timer-text">${this.formatTime(duration)}</div>
      </div>
    `;

    return container;
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
    timer.container.classList.add('active');

    const progressCircle = timer.container.querySelector('.timer-circle-progress');
    const textElement = timer.container.querySelector('.timer-text');
    const radius = 52;
    const circumference = 2 * Math.PI * radius;

    timer.interval = setInterval(() => {
      timer.remaining--;

      // Update text
      textElement.textContent = this.formatTime(timer.remaining);

      // Update circle progress
      const progress = timer.remaining / timer.duration;
      const offset = circumference * (1 - progress);
      progressCircle.style.strokeDashoffset = offset;

      // Change color when < 10s
      if (timer.remaining <= 10) {
        progressCircle.style.stroke = '#FF453A';
        textElement.style.color = '#FF453A';
      }

      // Timer finished
      if (timer.remaining <= 0) {
        this.finishTimer(timerId);
      }
    }, 1000);
  }

  pauseTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    timer.isActive = false;
    timer.container.classList.remove('active');
    
    if (timer.interval) {
      clearInterval(timer.interval);
      timer.interval = null;
    }
  }

  finishTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    this.pauseTimer(timerId);
    
    // Vibration + son
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Animation finale
    timer.container.classList.add('finished');
    setTimeout(() => {
      timer.container.classList.remove('finished');
      this.resetTimer(timerId);
    }, 2000);

    // Notification
    this.showNotification('⏰ Repos terminé !');
  }

  resetTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    timer.remaining = timer.duration;
    timer.isActive = false;
    
    const textElement = timer.container.querySelector('.timer-text');
    const progressCircle = timer.container.querySelector('.timer-circle-progress');
    
    textElement.textContent = this.formatTime(timer.duration);
    progressCircle.style.strokeDashoffset = '0';
    progressCircle.style.stroke = 'url(#timerGradient)';
    textElement.style.color = '#ffffff';
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✓ CHECKBOXES / VALIDATION SÉRIES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initCheckboxes() {
    document.querySelectorAll('.check-button, .checkbox, .validate-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCheck(btn);
      });
    });
  }

  toggleCheck(button) {
    const setCard = button.closest('.set-card, .set');
    const isChecked = button.classList.contains('checked');

    if (isChecked) {
      button.classList.remove('checked');
      setCard.classList.remove('completed');
      button.innerHTML = '';
    } else {
      button.classList.add('checked');
      setCard.classList.add('completed');
      button.innerHTML = '✓';
      
      // Démarrer le timer automatiquement
      const timerId = setCard.dataset.setId;
      if (timerId && this.timers.has(timerId)) {
        setTimeout(() => {
          this.startTimer(timerId);
        }, 500);
      }

      // Animation
      this.animateCompletion(setCard);
    }

    // Sauvegarder l'état
    this.saveCheckState(setCard, !isChecked);
  }

  animateCompletion(setCard) {
    setCard.style.transform = 'scale(1.02)';
    setTimeout(() => {
      setCard.style.transform = 'scale(1)';
    }, 300);
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
      const exercises = group.querySelectorAll('.exercise, .exercise-card');
      
      if (exercises.length < 2) return;

      // Récupérer le temps de repos (depuis dataset ou défaut)
      const restTime = parseInt(group.dataset.rest) || 90;

      // Créer UN SEUL timer pour le superset
      const supersetTimerId = `superset_${Date.now()}`;
      const timerContainer = this.createTimerHTML(restTime);
      timerContainer.classList.add('superset-timer');
      
      // Insérer le timer après le label du superset
      const label = group.querySelector('.superset-label');
      if (label) {
        label.after(timerContainer);
      } else {
        group.insertBefore(timerContainer, group.firstChild);
      }

      // Enregistrer le timer
      this.timers.set(supersetTimerId, {
        duration: restTime,
        remaining: restTime,
        isActive: false,
        interval: null,
        container: timerContainer
      });

      // Click sur timer
      timerContainer.addEventListener('click', () => {
        this.toggleTimer(supersetTimerId);
      });

      // Démarrer auto quand les 2 exercices sont validés
      this.watchSupersetCompletion(group, supersetTimerId);
    });
  }

  watchSupersetCompletion(group, timerId) {
    const checkButtons = group.querySelectorAll('.check-button, .checkbox, .validate-btn');
    
    checkButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const allChecked = Array.from(checkButtons).every(b => 
            b.classList.contains('checked')
          );

          if (allChecked) {
            // Tous les exercices du superset sont validés
            setTimeout(() => {
              this.startTimer(timerId);
            }, 500);

            // Reset les checks pour la série suivante
            setTimeout(() => {
              checkButtons.forEach(b => {
                b.classList.remove('checked');
                b.innerHTML = '';
                const setCard = b.closest('.set-card, .set');
                if (setCard) {
                  setCard.classList.remove('completed');
                }
              });
            }, 1000);
          }
        }, 100);
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📢 NOTIFICATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  showNotification(message) {
    // Vérifier si le navigateur supporte les notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hybrid Master 61', {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }

    // Toast UI fallback
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(48, 209, 88, 0.9);
      backdrop-filter: blur(20px);
      color: white;
      padding: 16px 24px;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔄 UTILITAIRES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  loadSavedData() {
    // Charger tous les états sauvegardés
    document.querySelectorAll('.set-card, .set').forEach(setCard => {
      const setId = setCard.dataset.setId;
      if (!setId) return;

      // Charger état checkbox
      const isChecked = localStorage.getItem(`check_${setId}`) === 'true';
      if (isChecked) {
        const checkbox = setCard.querySelector('.check-button, .checkbox');
        if (checkbox) {
          checkbox.classList.add('checked');
          checkbox.innerHTML = '✓';
          setCard.classList.add('completed');
        }
      }

      // Charger valeurs stats
      setCard.querySelectorAll('input[type="number"]').forEach(input => {
        const type = this.getStatType(
          input.closest('.stat-item, .stat')?.querySelector('.stat-label')?.textContent
        );
        const exerciseId = setCard.closest('.exercise, .exercise-card')?.dataset.exerciseId;
        const key = `workout_${exerciseId}_${setId}_${type}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          input.value = saved;
        }
      });
    });
  }

  resetWorkout() {
    if (!confirm('Réinitialiser toutes les données de cette séance ?')) return;

    // Clear localStorage
    const keys = Object.keys(localStorage).filter(k => 
      k.startsWith('workout_') || k.startsWith('check_')
    );
    keys.forEach(key => localStorage.removeItem(key));

    // Reset UI
    location.reload();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📱 DEMANDER PERMISSIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 🚀 INITIALISATION
// ═══════════════════════════════════════════════════════════

let workoutApp;

document.addEventListener('DOMContentLoaded', () => {
  workoutApp = new WorkoutInteractive();
  workoutApp.loadSavedData();
  workoutApp.requestNotificationPermission();

  console.log('💪 Hybrid Master 61 - Interactive Mode Activé');
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkoutInteractive;
}

// ═══════════════════════════════════════════════════════════
// 🎨 STYLES CSS ADDITIONNELS (à ajouter dans <style>)
// ═══════════════════════════════════════════════════════════

const additionalStyles = `
@keyframes slideUp {
  from { transform: translateX(-50%) translateY(20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateX(-50%) translateY(0); opacity: 1; }
  to { transform: translateX(-50%) translateY(20px); opacity: 0; }
}

.timer-container.active .timer-circle-progress {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 159, 10, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 159, 10, 0.8)); }
}

.timer-container.finished {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.superset-timer {
  width: 100px;
  height: 100px;
  margin: 16px auto;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = additionalStyles;
  document.head.appendChild(styleEl);
}
