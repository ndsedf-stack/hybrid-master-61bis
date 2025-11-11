import ProgramData from '../program-data.js';
import WorkoutRenderer from '../ui/workout-renderer.js';

export class HomeRenderer {
  constructor(containerId, onDaySelected) {
    this.container = document.getElementById(containerId);
    this.onDaySelected = onDaySelected;
    
    // 🎨 Icônes par jour
    this.dayIcons = {
      'lundi': '💪',
      'mardi': '🔥',
      'mercredi': '⚡',
      'jeudi': '💯',
      'vendredi': '🎯',
      'samedi': '🏋️',
      'dimanche': '🦵',
      'maison': '🏠'
    };
    
    // 🎨 Couleurs de gradient par jour
    this.dayColors = {
      'lundi': 'from-blue-500/20 to-purple-500/20',
      'mardi': 'from-orange-500/20 to-red-500/20',
      'mercredi': 'from-green-500/20 to-emerald-500/20',
      'jeudi': 'from-yellow-500/20 to-orange-500/20',
      'vendredi': 'from-purple-500/20 to-pink-500/20',
      'samedi': 'from-cyan-500/20 to-blue-500/20',
      'dimanche': 'from-red-500/20 to-orange-500/20',
      'maison': 'from-gray-500/20 to-slate-500/20'
    };
  }

  render(weekNumber, activeDay) {
    // Nettoie le conteneur
    this.container.innerHTML = '';

    // 🎨 Header de semaine moderne
    const header = document.createElement('div');
    header.className = 'week-header';
    header.innerHTML = `
      <div class="week-header-content">
        <div class="week-icon">📅</div>
        <div class="week-info">
          <h2 class="week-title">Semaine ${weekNumber}</h2>
          <p class="week-subtitle">Sélectionne un jour pour commencer</p>
        </div>
      </div>
    `;
    this.container.appendChild(header);

    // Récupère les données de la semaine
    const structureDays = ProgramData.getDaysList();
    const week = ProgramData.getWeek(weekNumber);
    const dayKeys = structureDays.filter(k => week[k]);

    // 🎨 Grille de cards moderne
    const grid = document.createElement('div');
    grid.className = 'home-grid';

    dayKeys.forEach((day, index) => {
      const workout = week[day];
      const exerciseCount = workout.blocks?.reduce((sum, block) => 
        sum + (block.exercises?.length || 0), 0) || 0;
      const blockCount = workout.blocks?.length || 0;

      // Card du jour
      const card = document.createElement('div');
      card.className = `day-card ${day === activeDay ? 'active' : ''}`;
      card.style.animationDelay = `${index * 0.1}s`;
      card.dataset.day = day;

      const icon = this.dayIcons[day.toLowerCase()] || '📋';
      
      card.innerHTML = `
        <div class="day-card-header">
          <div class="day-icon">${icon}</div>
          <div class="day-badges">
            ${exerciseCount > 0 ? `<span class="badge badge-primary">${exerciseCount} exercices</span>` : ''}
            ${blockCount > 0 ? `<span class="badge badge-secondary">${blockCount} blocs</span>` : ''}
          </div>
        </div>
        <h3 class="day-title">${this.capitalize(day)}</h3>
        <p class="day-description">
          ${workout.blocks && workout.blocks.length > 0 
            ? this.getWorkoutDescription(workout) 
            : 'Aucune séance prévue'}
        </p>
        <button class="day-button-cta ${day === activeDay ? 'active' : ''}">
          <span>${day === activeDay ? '✓ Sélectionné' : 'Commencer'}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;

      // ✅ Event listener pour sélection du jour
      card.addEventListener('click', (e) => {
        // Évite le double déclenchement si on clique directement sur le bouton
        if (!e.target.closest('.day-button-cta')) {
          this.selectDay(day, weekNumber);
        }
      });

      // Event listener spécifique pour le bouton CTA
      const ctaButton = card.querySelector('.day-button-cta');
      ctaButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectDay(day, weekNumber);
      });

      grid.appendChild(card);
    });

    this.container.appendChild(grid);

    // 🎨 Message si aucun jour disponible
    if (dayKeys.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <div class="empty-icon">📭</div>
        <h3>Aucune séance cette semaine</h3>
        <p>Il n'y a pas encore de séances programmées pour la semaine ${weekNumber}</p>
      `;
      this.container.appendChild(emptyState);
    }
  }

  // 🎯 Méthode pour sélectionner un jour
  selectDay(day, weekNumber) {
    if (this.onDaySelected) {
      this.onDaySelected(day, weekNumber);
    }
    // Met à jour visuellement les cards
    this.updateActiveCard(day);
  }

  // 🎨 Met à jour la card active
  updateActiveCard(activeDay) {
    const cards = this.container.querySelectorAll('.day-card');
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

  // 📝 Génère une description du workout
  getWorkoutDescription(workout) {
    if (!workout.blocks || workout.blocks.length === 0) {
      return 'Aucune séance prévue';
    }

    // Récupère les noms des groupes musculaires principaux
    const groups = new Set();
    workout.blocks.forEach(block => {
      if (block.exercises) {
        block.exercises.forEach(ex => {
          if (ex.muscle_group) {
            groups.add(ex.muscle_group);
          }
        });
      }
    });

    if (groups.size === 0) {
      return `${workout.blocks.length} bloc${workout.blocks.length > 1 ? 's' : ''}`;
    }

    const groupList = Array.from(groups).slice(0, 2).join(', ');
    const remaining = groups.size > 2 ? ` +${groups.size - 2}` : '';
    return `${groupList}${remaining}`;
  }

  // 🔤 Utilitaire pour capitaliser
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // 🎨 Animation d'entrée pour les nouvelles cards (optionnel)
  animateIn() {
    const cards = this.container.querySelectorAll('.day-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'all 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }, index * 100);
    });
  }
}
