// scripts/modules/home-renderer.js

export class HomeRenderer {
  constructor(onDaySelected) {
    this.onDaySelected = onDaySelected;
    console.log('🏠 HomeRenderer créé');
  }
  
  render(container, weekData) {
    console.log('🏠 Rendu de la page d\'accueil...');
    console.log('📊 Données reçues:', weekData);
    
    if (!container) {
      console.error('❌ Container introuvable');
      return;
    }
    
    if (!weekData || !weekData.days || weekData.days.length === 0) {
      console.error('❌ Données invalides');
      container.innerHTML = '<p>Erreur : Aucune donnée disponible</p>';
      return;
    }
    
    console.log(`✅ ${weekData.days.length} jours trouvés`);
    
    // Créer le HTML
    const html = `
      <div class="home-container">
        <h2 class="home-title">💪 Hybrid Master 61</h2>
        <p class="home-subtitle">Semaine ${weekData.week} - Sélectionne un jour</p>
        <div class="home-grid">
          ${weekData.days.map(day => this.createDayCard(day)).join('')}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // ✅ ATTACHER LES EVENT LISTENERS APRÈS L'INSERTION
    this.attachEventListeners(container, weekData.days);
    
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
    
    const icon = iconMap[day.day?.toLowerCase()] || iconMap[day.location?.toLowerCase()] || '💪';
    
    // Compter les exercices
    const exerciseCount = day.exercises ? day.exercises.length : 0;
    const totalSets = day.totalSets || (day.exercises ? day.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0) : 0);
    
    return `
      <div class="day-card" data-day="${day.day}">
        <div class="day-card-header">
          <div class="day-card-icon">${icon}</div>
          <h3 class="day-card-title">${this.capitalize(day.day)}</h3>
        </div>
        <div class="day-card-body">
          <p class="day-card-location">${day.location || 'Salle'}</p>
          <p class="day-card-meta">${exerciseCount} exercices • ${totalSets} séries</p>
        </div>
        <button class="day-card-button" data-day="${day.day}">
          COMMENCER ›
        </button>
      </div>
    `;
  }
  
  attachEventListeners(container, days) {
    console.log('🔗 Attachement des event listeners...');
    
    // Récupérer tous les boutons
    const buttons = container.querySelectorAll('.day-card-button');
    console.log(`📍 ${buttons.length} boutons trouvés`);
    
    buttons.forEach((button) => {
      const dayName = button.dataset.day;
      const dayData = days.find(d => d.day === dayName);
      
      if (!dayData) {
        console.error(`❌ Données introuvables pour ${dayName}`);
        return;
      }
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`✅ Clic sur bouton: ${dayName}`);
        this.handleDayClick(dayData);
      });
      
      console.log(`✅ Listener attaché pour: ${dayName}`);
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
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
