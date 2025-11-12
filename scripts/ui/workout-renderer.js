/**
 * WORKOUT RENDERER - Affichage des séances d'entraînement
 */

export default class WorkoutRenderer {
  constructor() {
    this.currentWorkout = null;
    console.log('✅ WorkoutRenderer initialisé');
  }

  renderWorkout(container, dayData, week, day) {
    console.log('🎨 Rendu de la séance...');
    console.log('📊 Données reçues:', dayData);
    
    if (!container) {
      console.error('❌ Container invalide');
      return;
    }

    if (!dayData || !dayData.exercises) {
      console.error('❌ Données de séance invalides');
      container.innerHTML = '<p>Erreur : Aucun exercice trouvé</p>';
      return;
    }

    this.currentWorkout = { week, day, data: dayData };

    // Récupérer le nom et la location de manière sûre
    const workoutName = dayData.name || dayData.day || day || 'Séance';
    const location = dayData.location || 'Salle';

    // Générer le HTML
    const html = `
      <div class="workout-container">
        <div class="workout-header">
          <h2 class="workout-title">${location.toUpperCase()}</h2>
          <div class="workout-meta">
            <span class="workout-week">Semaine ${week}</span>
            <span class="workout-day">${this.capitalize(day)}</span>
          </div>
          <div class="workout-stats">
            <span>${dayData.exercises.length} exercices</span>
            <span>${dayData.totalSets || this.countTotalSets(dayData.exercises)} séries</span>
          </div>
        </div>
        
        <div class="workout-content">
          ${dayData.exercises.map((exercise, index) => this.createExerciseCard(exercise, index)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // ✅ ATTACHER LES EVENT LISTENERS APRÈS L'INSERTION DU HTML
    this.attachEventListeners(container);
    
    console.log('✅ Séance affichée avec succès');
  }

  countTotalSets(exercises) {
    return exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  }

  createExerciseCard(exercise, index) {
    const hasRest = exercise.rest && exercise.rest > 0;
    
    return `
      <div class="exercise-card" data-exercise-index="${index}">
        <div class="exercise-header">
          <h3 class="exercise-name">${exercise.name}</h3>
          <span class="exercise-number">#${index + 1}</span>
        </div>
        
        <div class="exercise-details">
          <div class="detail-item">
            <span class="detail-label">Séries</span>
            <span class="detail-value">${exercise.sets}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Répétitions</span>
            <span class="detail-value">${exercise.reps}</span>
          </div>
          ${exercise.weight ? `
            <div class="detail-item">
              <span class="detail-label">Poids</span>
              <span class="detail-value">${exercise.weight}kg</span>
            </div>
          ` : ''}
          ${hasRest ? `
            <div class="detail-item">
              <span class="detail-label">Repos</span>
              <span class="detail-value">${exercise.rest}s</span>
            </div>
          ` : ''}
        </div>

        ${exercise.notes ? `
          <div class="exercise-notes">
            <span class="notes-icon">💡</span>
            <span>${exercise.notes}</span>
          </div>
        ` : ''}

        <div class="series-section">
          ${this.createSeriesSection(exercise, index)}
        </div>
      </div>
    `;
  }

  createSeriesSection(exercise, exerciseIndex) {
    const series = [];
    for (let i = 0; i < exercise.sets; i++) {
      series.push(`
        <div class="serie-item" data-exercise-index="${exerciseIndex}" data-set-index="${i}">
          <span class="serie-number">Série ${i + 1}</span>
          <div class="serie-info">
            <span class="serie-detail">${exercise.reps} reps</span>
            ${exercise.weight ? `<span class="serie-detail">${exercise.weight}kg</span>` : ''}
          </div>
          <button type="button" 
                  class="serie-check" 
                  data-exercise-index="${exerciseIndex}"
                  data-set-index="${i}"
                  data-rest-time="${exercise.rest || 0}"
                  data-exercise-name="${exercise.name}"
                  aria-label="Valider la série ${i + 1}">
            <span class="check-icon">✓</span>
          </button>
        </div>
      `);
    }
    return series.join('');
  }

  /**
   * ✅ FONCTION CRITIQUE : Attache les event listeners APRÈS l'insertion HTML
   */
  attachEventListeners(container) {
    console.log('🔗 Attachement des event listeners...');
    
    // Récupérer TOUS les boutons .serie-check
    const buttons = container.querySelectorAll('.serie-check');
    console.log(`📍 ${buttons.length} boutons trouvés`);

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('✅ Clic sur bouton série');
        this.handleSetCompletion(button);
      });
    });

    console.log('✅ Event listeners attachés');
  }

  /**
   * Gère la validation d'une série
   */
  handleSetCompletion(button) {
    console.log('🎯 handleSetCompletion appelé');
    
    // Récupérer les données du bouton
    const exerciseIndex = parseInt(button.dataset.exerciseIndex);
    const setIndex = parseInt(button.dataset.setIndex);
    const restTime = parseInt(button.dataset.restTime) || 0;
    const exerciseName = button.dataset.exerciseName;

    console.log(`📊 Série validée: ${exerciseName} - Set ${setIndex + 1}`);

    // Marquer comme complété
    const serieItem = button.closest('.serie-item');
    if (serieItem) {
      serieItem.classList.add('completed');
      button.classList.add('checked');
      button.disabled = true;
    }

    // TODO: Démarrer le timer si repos > 0
    if (restTime > 0) {
      console.log(`⏱️ Timer à implémenter: ${restTime}s pour ${exerciseName}`);
    }

    // Sauvegarder la progression
    this.saveProgress(exerciseIndex, setIndex);
  }

  /**
   * Sauvegarde la progression
   */
  saveProgress(exerciseIndex, setIndex) {
    if (!this.currentWorkout) return;

    const key = `workout_${this.currentWorkout.week}_${this.currentWorkout.day}_${exerciseIndex}_${setIndex}`;
    localStorage.setItem(key, 'completed');
    console.log(`💾 Progression sauvegardée: ${key}`);
  }

  /**
   * Capitalise la première lettre
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
