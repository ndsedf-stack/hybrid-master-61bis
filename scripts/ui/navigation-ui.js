/**
 * NAVIGATION UI - Gestion de l'interface de navigation
 */

export class NavigationUI {
    constructor() {
        this.currentWeek = 1;
        this.currentDay = 'dimanche';
        this.maxWeek = 26;
        
        // Éléments DOM
        this.weekDisplay = document.getElementById('week-display');
        this.prevWeekBtn = document.getElementById('prev-week');
        this.nextWeekBtn = document.getElementById('next-week');
        this.dayTabs = document.querySelectorAll('.day-tab');

        // 📊 Nouveaux éléments pour les statistiques
        this.workoutContainer = document.getElementById('workout-container');
        this.statsContainer = document.getElementById('statsRoot');
        this.statsBtn = document.getElementById('nav-stats');
        
        this.onWeekChange = null;
        this.onDayChange = null;
    }

    /**
     * Initialise les event listeners
     */
    init() {
        // Navigation semaines
        if (this.prevWeekBtn) {
            this.prevWeekBtn.addEventListener('click', () => this.previousWeek());
        }
        if (this.nextWeekBtn) {
            this.nextWeekBtn.addEventListener('click', () => this.nextWeek());
        }

        // Navigation jours
        this.dayTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.currentTarget.dataset.day;
                this.selectDay(day);
            });
        });

        // 📊 Bouton Stats
        if (this.statsBtn) {
            this.statsBtn.addEventListener('click', () => this.toggleStats());
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
        if (weekNumber < 1 || weekNumber > this.maxWeek) {
            console.warn(`⚠️ Semaine ${weekNumber} invalide`);
            return;
        }

        this.currentWeek = weekNumber;
        this.updateDisplay();

        if (this.onWeekChange) {
            this.onWeekChange(this.currentWeek, this.currentDay);
        }
    }

    /**
     * Semaine précédente
     */
    previousWeek() {
        if (this.currentWeek > 1) {
            this.goToWeek(this.currentWeek - 1);
        }
    }

    /**
     * Semaine suivante
     */
    nextWeek() {
        if (this.currentWeek < this.maxWeek) {
            this.goToWeek(this.currentWeek + 1);
        }
    }

    /**
     * Sélectionne un jour
     */
    selectDay(day) {
        this.currentDay = day;

        // Update active state
        this.dayTabs.forEach(tab => {
            if (tab.dataset.day === day) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        if (this.onDayChange) {
            this.onDayChange(this.currentWeek, this.currentDay);
        }
    }

    /**
     * 📊 Bascule entre Workout et Statistiques
     */
    toggleStats() {
        if (!this.workoutContainer || !this.statsContainer) return;

        const isStatsVisible = !this.statsContainer.classList.contains('hidden');

        if (isStatsVisible) {
            this.statsContainer.classList.add('hidden');
            this.workoutContainer.classList.remove('hidden');
        } else {
            this.workoutContainer.classList.add('hidden');
            this.statsContainer.classList.remove('hidden');
        }
    }

    /**
     * Met à jour l'affichage
     */
    updateDisplay() {
        if (this.weekDisplay) {
            const weekInfo = this.weekDisplay.querySelector('.week-info');
            if (weekInfo) {
                const weekNumber = weekInfo.querySelector('.week-number');
                if (weekNumber) {
                    weekNumber.textContent = `Semaine ${this.currentWeek}`;
                }
            }
        }

        // Désactive les boutons si nécessaire
        if (this.prevWeekBtn) {
            this.prevWeekBtn.disabled = this.currentWeek <= 1;
        }
        if (this.nextWeekBtn) {
            this.nextWeekBtn.disabled = this.currentWeek >= this.maxWeek;
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
