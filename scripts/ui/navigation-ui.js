/**
 * NAVIGATION UI - Gestion de l'interface de navigation
 */
export class NavigationUI {
  constructor(onWeekChange, onHomeClick) {
    this.currentWeek = 1;
    this.maxWeek = 26;
    
    // Callbacks
    this.onWeekChange = onWeekChange;
    this.onHomeClick = onHomeClick;
    
    console.log('✅ NavigationUI créé');
    this.init();
  }

  /**
   * Initialise les event listeners
   */
  init() {
    // Éléments DOM
    const prevBtn = document.getElementById('nav-prev-week');
    const nextBtn = document.getElementById('nav-next-week');
    const weekLabel = document.getElementById('current-week-label');
    
    if (!prevBtn || !nextBtn) {
      console.error('❌ Boutons de navigation introuvables');
      return;
    }

    // Navigation semaines
    prevBtn.addEventListener('click', () => {
      console.log('⬅️ Clic sur précédent');
      this.previousWeek();
    });

    nextBtn.addEventListener('click', () => {
      console.log('➡️ Clic sur suivant');
      this.nextWeek();
    });

    // Clic sur le label pour retour accueil
    if (weekLabel) {
      weekLabel.addEventListener('click', () => {
        console.log('🏠 Clic sur label semaine');
        if (this.onHomeClick) {
          this.onHomeClick();
        }
      });
      weekLabel.style.cursor = 'pointer';
    }

    this.updateDisplay();
    console.log('✅ NavigationUI initialisé');
  }

  /**
   * Change de semaine
   */
  goToWeek(weekNumber) {
    if (weekNumber < 1 || weekNumber > this.maxWeek) {
      console.warn(`⚠️ Semaine ${weekNumber} invalide`);
      return;
    }

    console.log(`📅 Changement vers semaine ${weekNumber}`);
    this.currentWeek = weekNumber;
    this.updateDisplay();

    if (this.onWeekChange) {
      this.onWeekChange(this.currentWeek);
    }
  }

  /**
   * Semaine précédente
   */
  previousWeek() {
    if (this.currentWeek > 1) {
      this.goToWeek(this.currentWeek - 1);
    } else {
      console.log('⚠️ Déjà à la semaine 1');
    }
  }

  /**
   * Semaine suivante
   */
  nextWeek() {
    if (this.currentWeek < this.maxWeek) {
      this.goToWeek(this.currentWeek + 1);
    } else {
      console.log('⚠️ Déjà à la dernière semaine');
    }
  }

  /**
   * Met à jour l'affichage
   */
  updateDisplay() {
    const weekLabel = document.getElementById('current-week-label');
    const prevBtn = document.getElementById('nav-prev-week');
    const nextBtn = document.getElementById('nav-next-week');

    if (weekLabel) {
      weekLabel.textContent = `Semaine ${this.currentWeek}`;
    }

    // Désactive les boutons si nécessaire
    if (prevBtn) {
      prevBtn.disabled = this.currentWeek <= 1;
      prevBtn.style.opacity = this.currentWeek <= 1 ? '0.3' : '1';
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentWeek >= this.maxWeek;
      nextBtn.style.opacity = this.currentWeek >= this.maxWeek ? '0.3' : '1';
    }

    console.log(`📊 Affichage mis à jour: Semaine ${this.currentWeek}`);
  }

  /**
   * Récupère l'état actuel
   */
  getState() {
    return {
      week: this.currentWeek
    };
  }
}
