// scripts/modules/home-renderer.js
export class HomeRenderer {
  constructor() {
    console.log('🏠 HomeRenderer créé');
  }

  render(weekData) {
    if (!weekData || !weekData.days) {
      console.error('❌ weekData invalide:', weekData);
      return '<p>Erreur: données invalides</p>';
    }

    const cardsHTML = weekData.days
      .map(day => this.renderCard(day))
      .join('');

    return `
      <div class="home-grid">
        ${cardsHTML}
      </div>
    `;
  }

  renderCard(day) {
    const duration = day.duration || 60;
    const exerciseCount = day.exercises ? day.exercises.length : 0;
    
    // FIX du calcul des séries (AVANT c'était NaN)
    let totalSets = 0;
    if (day.exercises && Array.isArray(day.exercises)) {
      totalSets = day.exercises.reduce((sum, ex) => {
        // Essaie plusieurs structures possibles
        if (typeof ex.sets === 'number') return sum + ex.sets;
        if (Array.isArray(ex.sets)) return sum + ex.sets.length;
        if (typeof ex.series === 'number') return sum + ex.series;
        if (Array.isArray(ex.series)) return sum + ex.series.length;
        return sum + 4; // Défaut si structure inconnue
      }, 0);
    }

    return `
      <div class="workout-card" data-day="${day.day}">
        <div class="card-badge">
          ${day.block || 'Bloc 1'} ${day.tempo || 'Tempo 3-1-2'}
        </div>
        
        <h3 class="card-day">${day.day || 'Jour'}</h3>
        <p class="card-title">${day.name || 'Entraînement'}</p>
        
        <div class="card-stats">
          <div class="card-stat">
            <span class="card-stat-icon">⏱️</span>
            <span class="card-stat-value">${duration}</span>
            <span class="card-stat-label">min</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-icon">💪</span>
            <span class="card-stat-value">${totalSets}</span>
            <span class="card-stat-label">séries</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-icon">🏋️</span>
            <span class="card-stat-value">${exerciseCount}</span>
            <span class="card-stat-label">exercices</span>
          </div>
        </div>
        
        <button class="card-button" onclick="window.startWorkout('${day.day}')">
          COMMENCER <span class="card-button-icon">→</span>
        </button>
      </div>
    `;
  }
}
