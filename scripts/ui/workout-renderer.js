import ProgramData from '../program-data.js';

export default class WorkoutRenderer {
  constructor() {
    this.container = document.getElementById('workout-container');
    this.timerManager = null;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = '';
  }

  render(workout, week) {
    if (!this.container) return;
    this.container.innerHTML = '';

    // En-tête de séance moderne
    const header = document.createElement('div');
    header.className = 'workout-header';
    header.innerHTML = `
      <h2>${workout.name}</h2>
      <p class="block-info">
        Bloc ${week.block} • ${week.technique} • RPE cible ${week.rpeTarget}
        ${week.isDeload ? ' 🔄 (Deload)' : ''}
      </p>
    `;
    this.container.appendChild(header);

    // Rendu des exercices
    workout.exercises.forEach((ex, index) => {
      const card = this.createExerciseCard(ex, index);
      this.container.appendChild(card);
    });
  }

  createExerciseCard(ex, index) {
    const card = document.createElement('section');
    card.className = 'exercise-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Icône d'exercice (optionnel, basé sur le type)
    const icon = this.getExerciseIcon(ex.name);

    // Titre avec icône
    const header = document.createElement('div');
    header.className = 'exercise-header';
    header.innerHTML = `
      <div class="exercise-icon">${icon}</div>
      <div class="exercise-title">
        <h3 class="exercise-name">${ex.name}</h3>
        <div class="exercise-details">
          <span>${ex.sets} séries</span>
          <span>${ex.reps} reps</span>
          <span>${ex.weight}kg</span>
          <span>Tempo ${ex.tempo}</span>
          <span>RPE ${ex.rpe}</span>
        </div>
      </div>
    `;
    card.appendChild(header);

    // Corps de la carte
    const body = document.createElement('div');
    body.className = 'exercise-body';

    // Notes si présentes
    if (ex.notes) {
      const notes = document.createElement('div');
      notes.className = 'exercise-notes';
      notes.textContent = ex.notes;
      body.appendChild(notes);
    }

    // Rendu des séries
    this.renderSeries(ex, body);
    
    card.appendChild(body);
    return card;
  }

  getExerciseIcon(exerciseName) {
    const name = exerciseName.toLowerCase();
    
    // Exercices de poussée
    if (name.includes('développé') || name.includes('bench') || name.includes('press')) {
      return '💪';
    }
    // Exercices de tirage
    if (name.includes('traction') || name.includes('rowing') || name.includes('pull')) {
      return '🎯';
    }
    // Exercices de jambes
    if (name.includes('squat') || name.includes('leg') || name.includes('jambe')) {
      return '🦵';
    }
    // Exercices de dos
    if (name.includes('deadlift') || name.includes('soulevé')) {
      return '⚡';
    }
    // Exercices d'épaules
    if (name.includes('épaule') || name.includes('shoulder') || name.includes('élévation')) {
      return '🔥';
    }
    // Exercices de bras
    if (name.includes('curl') || name.includes('tricep') || name.includes('bicep')) {
      return '💥';
    }
    // Par défaut
    return '🏋️';
  }

  renderSeries(exercise, container) {
    const sets = exercise.sets;
    const reps = exercise.reps;
    const weight = exercise.weight;
    const rest = exercise.rest;

    // Conversion en tableau de séries
    const seriesArray = typeof sets === 'number'
      ? Array.from({ length: sets }, () => ({ reps, weight, rest }))
      : Array.isArray(sets)
      ? sets
      : [sets];

    // Conteneur des séries
    const seriesContainer = document.createElement('div');
    seriesContainer.className = 'series-container';

    seriesArray.forEach((serie, index) => {
      const serieItem = this.createSerieItem(serie, index, exercise, rest);
      seriesContainer.appendChild(serieItem);
    });

    container.appendChild(seriesContainer);
  }

  createSerieItem(serie, index, exercise, defaultRest) {
    const serieItem = document.createElement('div');
    serieItem.className = 'serie-item';
    serieItem.dataset.exerciseId = exercise.id || exercise.name;
    serieItem.dataset.setNumber = index + 1;

    // Numéro de série
    const number = document.createElement('div');
    number.className = 'serie-number';
    number.textContent = index + 1;
    serieItem.appendChild(number);

    // Informations (reps + poids)
    const info = document.createElement('div');
    info.className = 'serie-info';
    
    const repsDiv = document.createElement('div');
    repsDiv.className = 'serie-reps';
    repsDiv.textContent = `${serie.reps} reps`;
    
    const weightDiv = document.createElement('div');
    weightDiv.className = 'serie-weight';
    weightDiv.textContent = `${serie.weight} kg`;
    
    info.appendChild(repsDiv);
    info.appendChild(weightDiv);
    serieItem.appendChild(info);

    // Temps de repos
    const restDiv = document.createElement('div');
    restDiv.className = 'serie-rest';
    restDiv.innerHTML = `
      <span class="rest-icon">⏱️</span>
      <span class="rest-time">${serie.rest || defaultRest || 90}s</span>
    `;
    serieItem.appendChild(restDiv);

    // Bouton de validation
    const button = document.createElement('div');
    button.className = 'serie-check';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', `Valider série ${index + 1}`);
    button.dataset.exerciseId = exercise.id || exercise.name;
    button.dataset.setNumber = index + 1;

    const icon = document.createElement('span');
    icon.className = 'check-icon';
    icon.textContent = '✓';
    button.appendChild(icon);

    serieItem.appendChild(button);

    // Gestion du clic/validation
    button.addEventListener('click', () => {
      this.toggleSerieCompletion(serieItem, button);
    });

    return serieItem;
  }

  toggleSerieCompletion(serieItem, button) {
    const isCompleted = serieItem.classList.contains('completed');
    
    if (isCompleted) {
      serieItem.classList.remove('completed');
      button.setAttribute('aria-checked', 'false');
    } else {
      serieItem.classList.add('completed');
      button.setAttribute('aria-checked', 'true');
      
      // Animation de validation
      serieItem.style.animation = 'none';
      setTimeout(() => {
        serieItem.style.animation = '';
      }, 10);
      
      // Démarrer le timer de repos si disponible
      if (this.timerManager) {
        const restTime = serieItem.querySelector('.rest-time')?.textContent;
        if (restTime) {
          const seconds = parseInt(restTime);
          this.timerManager.startTimer(seconds);
        }
      }
    }
  }

  renderEmpty(dayName) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="empty-workout">
        <div class="empty-icon">😴</div>
        <h2>${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</h2>
        <p>Aucun entraînement prévu pour cette journée.</p>
        <p class="empty-hint">Profite de ce jour de repos ! 💪</p>
      </div>
    `;
  }

  renderSupersets(weekNumber, dayName) {
    const supersets = ProgramData.getSupersetsForDay(weekNumber, dayName);
    if (!supersets.length) return;

    const supersetContainer = document.createElement('div');
    supersetContainer.className = 'superset-container';
    supersetContainer.innerHTML = `
      <div class="superset-header">
        <span class="superset-icon">⚡</span>
        <h3>Supersets du jour</h3>
      </div>
    `;

    supersets.forEach((pair, index) => {
      const item = document.createElement('div');
      item.className = 'superset-item';
      item.innerHTML = `
        <span class="superset-number">${index + 1}</span>
        <div class="superset-exercises">
          <span class="superset-exercise">${pair.exercise1.name}</span>
          <span class="superset-divider">↔</span>
          <span class="superset-exercise">${pair.exercise2.name}</span>
        </div>
      `;
      supersetContainer.appendChild(item);
    });

    this.container.appendChild(supersetContainer);
  }

  // Méthode pour injecter le TimerManager
  setTimerManager(timerManager) {
    this.timerManager = timerManager;
  }

  // Méthode pour récupérer l'état des séries complétées
  getCompletedSets() {
    const completed = [];
    const items = this.container.querySelectorAll('.serie-item.completed');
    items.forEach(item => {
      completed.push({
        exerciseId: item.dataset.exerciseId,
        setNumber: item.dataset.setNumber
      });
    });
    return completed;
  }

  // Méthode pour restaurer l'état des séries complétées
  restoreCompletedSets(completedSets) {
    completedSets.forEach(({ exerciseId, setNumber }) => {
      const item = this.container.querySelector(
        `.serie-item[data-exercise-id="${exerciseId}"][data-set-number="${setNumber}"]`
      );
      if (item) {
        item.classList.add('completed');
        const button = item.querySelector('.serie-check');
        if (button) {
          button.setAttribute('aria-checked', 'true');
        }
      }
    });
  }
}
