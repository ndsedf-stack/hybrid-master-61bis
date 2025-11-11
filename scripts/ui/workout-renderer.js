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

    const icon = this.getExerciseIcon(ex.name);

    const header = document.createElement('div');
    header.className = 'exercise-header';
    header.innerHTML = `
      <div class="exercise-icon">${icon}</div>
      <div class="exercise-title">
        <h3 class="exercise-name">${ex.name}</h3>
        <div class="exercise-details">
          <span>${this.getTotalSets(ex)} séries</span>
          <span>${ex.reps} reps</span>
          <span>${ex.weight}kg</span>
          <span>Tempo ${ex.tempo}</span>
          <span>RPE ${ex.rpe}</span>
        </div>
      </div>
    `;
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'exercise-body';

    if (ex.notes) {
      const notes = document.createElement('div');
      notes.className = 'exercise-notes';
      notes.textContent = ex.notes;
      body.appendChild(notes);
    }

    this.renderSeries(ex, body);
    card.appendChild(body);
    return card;
  }

  getExerciseIcon(exerciseName) {
    const name = exerciseName.toLowerCase();
    if (name.includes('développé') || name.includes('bench') || name.includes('press')) return '💪';
    if (name.includes('traction') || name.includes('rowing') || name.includes('pull')) return '🎯';
    if (name.includes('squat') || name.includes('leg') || name.includes('jambe')) return '🦵';
    if (name.includes('deadlift') || name.includes('soulevé')) return '⚡';
    if (name.includes('épaule') || name.includes('shoulder') || name.includes('élévation')) return '🔥';
    if (name.includes('curl') || name.includes('tricep') || name.includes('bicep')) return '💥';
    return '🏋️';
  }

  renderSeries(exercise, container) {
    const seriesArray = this.normalizeSets(exercise.sets, exercise.reps, exercise.weight, exercise.rest);

    const seriesContainer = document.createElement('div');
    seriesContainer.className = 'series-container';

    seriesArray.forEach((serie, index) => {
      const serieItem = this.createSerieItem(serie, index, exercise);
      seriesContainer.appendChild(serieItem);
    });

    container.appendChild(seriesContainer);
  }

  normalizeSets(sets, reps, weight, rest) {
    if (typeof sets === 'number') {
      return Array.from({ length: sets }, () => ({ reps, weight, rest }));
    }
    if (Array.isArray(sets)) return sets;
    if (sets) return [sets];
    return [{ reps, weight, rest }];
  }

  getTotalSets(exercise) {
    if (typeof exercise.sets === 'number') return exercise.sets;
    if (Array.isArray(exercise.sets)) return exercise.sets.length;
    return 1;
  }

  createSerieItem(serie, index, exercise) {
    const defaultRest = exercise.rest || 90;

    const serieItem = document.createElement('div');
    serieItem.className = 'serie-item';
    serieItem.dataset.exerciseId = exercise.id || exercise.name;
    serieItem.dataset.setNumber = index + 1;

    // ✅ Ligne compacte : numéro, reps, poids, repos, case
    serieItem.innerHTML = `
      <div class="serie-number">${index + 1}</div>
      <div class="serie-info">
        <div class="serie-reps">${serie.reps} reps</div>
        <div class="serie-weight">${serie.weight} kg</div>
      </div>
      <div class="serie-rest">
        <span class="rest-icon">⏱️</span>
        <span class="rest-time">${serie.rest || defaultRest}s</span>
      </div>
      <button class="serie-check" type="button"
        data-exercise-id="${exercise.id || exercise.name}"
        data-set-number="${index + 1}">
        <span class="check-icon">✓</span>
      </button>
    `;

    const button = serieItem.querySelector('.serie-check');
    button.addEventListener('click', () => {
      if (serieItem.classList.contains('completed')) return;

      serieItem.classList.add('completed');
      button.setAttribute('aria-checked', 'true');

      const seconds = parseInt((serie.rest || defaultRest), 10);
      if (this.timerManager) {
        const totalSets = this.getTotalSets(exercise);
        this.timerManager.start(seconds, exercise.name || (exercise.id ?? 'Exercice'), index + 1, totalSets);
      }
    });

    return serieItem;
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

  setTimerManager(timerManager) {
    this.timerManager = timerManager;
  }

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
