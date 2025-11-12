/**
 * NAVIGATION UI - Gestion de l'interface de navigation
 */
export class NavigationUI {
    constructor() {
        this.currentWeek = 1;
        this.currentDay = 'dimanche';
        this.maxWeek = 26;
        
        // Éléments DOM
        this.prevWeekBtn = document.getElementById('nav-prev-week');
        this.nextWeekBtn = document.getElementById('nav-next-week');
        this.weekLabel = document.getElementById('current-week-label');
        
        // Callbacks
        this.onWeekChange = null;
        this.onDayChange = null;
        
        console.log('🧭 NavigationUI créé');
    }

    /**
     * Initialise les event listeners
     */
    init() {
        console.log('🔧 Initialisation NavigationUI...');
        
        // Navigation semaines
        if (this.prevWeekBtn) {
            this.prevWeekBtn.addEventListener('click', () => {
                console.log('👈 Clic bouton précédent');
                this.previousWeek();
            });
        }
        
        if (this.nextWeekBtn) {
            this.nextWeekBtn.addEventListener('click', () => {
                console.log('👉 Clic bouton suivant');
                this.nextWeek();
            });
        }

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousWeek();
            if (e.key === 'ArrowRight') this.nextWeek();
        });

        this.updateDisplay();
        console.log('✅ NavigationUI initialisé');
    }

    /**
     * Change de semaine
     */
    goToWeek(weekNumber) {
        console.log(`📅 goToWeek appelé avec: ${weekNumber}`);
        
        if (weekNumber < 1 || weekNumber > this.maxWeek) {
            console.warn(`⚠️ Semaine ${weekNumber} invalide`);
            return;
        }

        this.currentWeek = weekNumber;
        console.log(`✅ Semaine changée vers: ${this.currentWeek}`);
        
        this.updateDisplay();

        if (this.onWeekChange) {
            console.log(`🔄 Appel callback onWeekChange(${this.currentWeek})`);
            this.onWeekChange(this.currentWeek);
        }
    }

    /**
     * Semaine précédente
     */
    previousWeek() {
        console.log(`⬅️ previousWeek: ${this.currentWeek} -> ${this.currentWeek - 1}`);
        
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
        console.log(`➡️ nextWeek: ${this.currentWeek} -> ${this.currentWeek + 1}`);
        
        if (this.currentWeek < this.maxWeek) {
            this.goToWeek(this.currentWeek + 1);
        } else {
            console.log('⚠️ Déjà à la semaine 26');
        }
    }

    /**
     * Sélectionne un jour
     */
    selectDay(day) {
        this.currentDay = day;
        
        if (this.onDayChange) {
            this.onDayChange(this.currentWeek, this.currentDay);
        }
    }

    /**
     * Met à jour l'affichage
     */
    updateDisplay() {
        console.log(`🔄 Affichage mis à jour: Semaine ${this.currentWeek}`);
        
        // Mettre à jour le label de semaine
        if (this.weekLabel) {
            this.weekLabel.textContent = `Semaine ${this.currentWeek}`;
        }

        // Désactiver les boutons si nécessaire
        if (this.prevWeekBtn) {
            this.prevWeekBtn.disabled = this.currentWeek <= 1;
            this.prevWeekBtn.style.opacity = this.currentWeek <= 1 ? '0.5' : '1';
        }
        
        if (this.nextWeekBtn) {
            this.nextWeekBtn.disabled = this.currentWeek >= this.maxWeek;
            this.nextWeekBtn.style.opacity = this.currentWeek >= this.maxWeek ? '0.5' : '1';
        }
    }

    /**
     * Récupère l'état actuel
     */
    getState() {
        return {
            week: this.currentWeek,
            day: this.currentDay
        };
    }

    /**
     * Restaure un état
     */
    setState(week, day) {
        this.goToWeek(week);
        this.selectDay(day);
    }
}

console.log('✅ NavigationUI module chargé');
