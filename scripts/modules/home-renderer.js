// scripts/modules/home-renderer.js

export class HomeRenderer {
  constructor(containerId, onDaySelected) {
    this.containerId = containerId;
    this.onDaySelected = onDaySelected;
    
    console.log('🏠 HomeRenderer créé');
  }
  
  render(container, programData) {
    console.log('🏠 Rendu de la page d\'accueil...');
    console.log('📊 Données reçues:', programData);
    
    if (!container) {
      console.error('❌ Container introuvable');
      return;
    }
    
    if (!programData || !programData.weeks || programData.weeks.length === 0) {
      console.error('❌ Données programme invalides');
      container.innerHTML = '<p>Erreur : Aucune donnée disponible</p>';
      return;
    }
    
    const firstWeek = programData.weeks[0];
    
    if (!firstWeek.days || firstWeek.days.length === 0) {
      console.error('❌ Aucun jour trouvé dans la semaine');
      container.innerHTML = '<p>Erreur : Aucun jour disponible</p>';
      return;
    }
    
    console.log(`✅ ${firstWeek.days.length} jours trouvés`);
    
    // Créer le HTML
    const html = `
      <div class="home-container">
        <h2 class="home-title">💪 Hybrid Master 61</h2>
        <p class="home-subtitle">Sélectionne un jour pour commencer</p>
        <div class="home-grid">
          ${firstWeek.days.map(day => this.createDayCard(day)).join('')}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // ✅ ATTACHER LES EVENT LISTENERS APRÈS L'INSERTION
    this.attachEventListeners(container, firstWeek.days);
    
    console.log('✅ Page d\'accueil affichée');
  }
  
  createDayCard(day) {
    const iconMap = {
      'dimanche': '🏠',
      'maison': '🏠',
      'mardi': '🏋️',
      'vendredi': '🏋️',
      'salle': '🏋️'
    };
    
    const icon = iconMap[day.day.toLowerCase()] || iconMap[day.location?.toLowerCase()] || '💪';
    
    // Compter les exercices
    const exerciseCount = day.exercises ? day.exercises.length : 0;
    const totalSets = day.totalSets || 0;
    
    // Premiers exercices (max 3)
    const exerciseList = day.exercises
      ? day.exercises.slice(0, 3).map(ex => `• ${ex.name}`).join('\n')
      : '';
    
    const hasMore = exerciseCount > 3;
    
    return `
      <div class="day-card" data-day="${day.day}">
        <div class="day-card-icon">${icon}</div>
        <div class="day-card-info">
          <p class="day-card-meta">${exerciseCount} exercices ${totalSets} séries</p>
          <h3 class="day-card-title">${this.capitalize(day.day)}</h3>
          <p class="day-card-location">${day.location} • ${exerciseCount} exercices</p>
          <div class="day-card-exercises">
            ${exerciseList}
            ${hasMore ? `+${exerciseCount - 3} autres` : ''}
          </div>
        </div>
        <button class="day-card-button" data-day="${day.day}">
          COMMENCER ›
        </button>
      </div>
    `;
  }
  
  attachEventListeners(container, days) {
    console.log('🔗 Attachement des event listeners...');
    
    // Récupérer toutes les cartes
    const cards = container.querySelectorAll('.day-card');
    const buttons = container.querySelectorAll('.day-card-button');
    
    console.log(`📍 ${cards.length} cartes trouvées`);
    console.log(`📍 ${buttons.length} boutons trouvés`);
    
    // Attacher les listeners sur les cartes ET les boutons
    cards.forEach((card, index) => {
      const dayName = card.dataset.day;
      const dayData = days.find(d => d.day === dayName);
      
      if (!dayData) {
        console.error(`❌ Données introuvables pour ${dayName}`);
        return;
      }
      
      // Clic sur la carte
      card.addEventListener('click', (e) => {
        // Ne pas déclencher si on clique sur le bouton
        if (e.target.closest('.day-card-button')) return;
        
        console.log(`✅ Clic sur carte: ${dayName}`);
        this.handleDayClick(dayData);
      });
      
      console.log(`✅ Listener attaché pour carte: ${dayName}`);
    });
    
    // Attacher les listeners sur les boutons
    buttons.forEach((button) => {
      const dayName = button.dataset.day;
      const dayData = days.find(d => d.day === dayName);
      
      if (!dayData) {
        console.error(`❌ Données introuvables pour bouton ${dayName}`);
        return;
      }
      
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Éviter la propagation à la carte
        console.log(`✅ Clic sur bouton: ${dayName}`);
        this.handleDayClick(dayData);
      });
      
      console.log(`✅ Listener attaché pour bouton: ${dayName}`);
    });
    
    console.log('✅ Tous les event listeners attachés');
  }
  
  handleDayClick(dayData) {
    console.log('🎯 Jour sélectionné:', dayData);
    
    if (this.onDaySelected) {
      this.onDaySelected(dayData);
    } else {
      console.error('❌ Callback onDaySelected non défini');
    }
  }
  
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
