/**
 * HOME RENDERER - Affichage de la page d'accueil
 */

export class HomeRenderer {
  constructor() {
    this.onDaySelect = null;
  }

  render(container, programData) {
    if (!container) {
      console.error('❌ Container invalide pour HomeRenderer');
      return;
    }

    console.log('🏠 Rendu de la page d\'accueil');

    // Icônes par type de séance
    const locationIcons = {
      'Maison': '🏠',
      'Salle': '🏋️',
      'Repos': '😴'
    };

    // Générer le HTML de la page d'accueil
    const html = `
      <div class="home-container">
        <div class="home-header">
          <div class="home-icon">💪</div>
          <h1 class="home-title">Hybrid Master 61</h1>
          <p class="home-subtitle">Sélectionne un jour pour commencer</p>
        </div>

        <div class="home-grid">
          ${this.createDayCards(programData, locationIcons)}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attacher les event listeners après insertion du HTML
    this.attachEventListeners(container);
  }

  createDayCards(programData, locationIcons) {
    // Récupérer les jours disponibles depuis la première semaine
    const firstWeek = programData.weeks[0];
    if (!firstWeek || !firstWeek.days) {
      console.error('❌ Structure de données invalide');
      return '<p>Erreur : Données du programme introuvables</p>';
    }

    // Générer une carte pour chaque jour
    return firstWeek.days.map((dayData, index) => {
      const icon = locationIcons[dayData.location] || '📋';
      const exerciseCount = dayData.exercises ? dayData.exercises.length : 0;
      
      // Calculer le nombre total de séries
      let totalSets = 0;
      if (dayData.exercises) {
        dayData.exercises.forEach(ex => {
          totalSets += ex.sets || 0;
        });
      }

      return `
        <div class="day-card" data-day="${dayData.day}" style="animation-delay: ${index * 0.1}s">
          <div class="day-card-header">
            <div class="day-icon">${icon}</div>
            <div class="day-badges">
              ${exerciseCount > 0 ? `<span class="badge badge-primary">${exerciseCount} exercices</span>` : ''}
              ${totalSets > 0 ? `<span class="badge badge-secondary">${totalSets} séries</span>` : ''}
            </div>
          </div>
          
          <h3 class="day-title">${this.capitalize(dayData.day)}</h3>
          
          <p class="day-description">
            ${dayData.location}${exerciseCount > 0 ? ` • ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}` : ''}
          </p>
          
          ${this.createExercisePreview(dayData.exercises)}
          
          <button class="day-button-cta" data-day="${dayData.day}">
            <span>Commencer</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }

  createExercisePreview(exercises) {
    if (!exercises || exercises.length === 0) {
      return '<div class="exercise-preview">Aucun exercice</div>';
    }

    // Afficher les 3 premiers exercices
    const preview = exercises.slice(0, 3).map(ex => 
      `<div class="exercise-preview-item">• ${ex.name}</div>`
    ).join('');

    const remaining = exercises.length > 3 ? 
      `<div class="exercise-preview-more">+${exercises.length - 3} autres</div>` : '';

    return `
      <div class="exercise-preview">
        ${preview}
        ${remaining}
      </div>
    `;
  }

  attachEventListeners(container) {
    console.log('🔗 Attachement des event listeners HomeRenderer...');

    // Récupérer toutes les cartes de jour
    const dayCards = container.querySelectorAll('.day-card');
    console.log(`📍 ${dayCards.length} cartes de jour trouvées`);

    dayCards.forEach((card) => {
      // Event sur toute la carte
      card.addEventListener('click', (e) => {
        // Ne pas déclencher si on clique sur le bouton
        if (!e.target.closest('.day-button-cta')) {
          const day = card.dataset.day;
          console.log(`✅ Clic sur carte: ${day}`);
          this.handleDaySelect(day);
        }
      });

      // Event sur le bouton spécifiquement
      const button = card.querySelector('.day-button-cta');
      if (button) {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const day = button.dataset.day;
          console.log(`✅ Clic sur bouton: ${day}`);
          this.handleDaySelect(day);
        });
      }
    });

    console.log('✅ Event listeners HomeRenderer attachés');
  }

  handleDaySelect(day) {
    console.log(`🎯 Jour sélectionné: ${day}`);
    
    if (this.onDaySelect) {
      this.onDaySelect(day);
    } else {
      console.warn('⚠️ Callback onDaySelect non défini');
    }

    // Mettre à jour l'état visuel des cartes
    this.updateActiveCard(day);
  }

  updateActiveCard(activeDay) {
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
      const isActive = card.dataset.day === activeDay;
      card.classList.toggle('active', isActive);
      
      const button = card.querySelector('.day-button-cta');
      if (button) {
        button.classList.toggle('active', isActive);
        const span = button.querySelector('span');
        if (span) {
          span.textContent = isActive ? '✓ Sélectionné' : 'Commencer';
        }
      }
    });
  }

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
