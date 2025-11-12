// scripts/modules/home-renderer.js
export class HomeRenderer {
    constructor(containerId, onDaySelected) {
        this.containerId = containerId;
        this.onDaySelected = onDaySelected;
        console.log('🏠 HomeRenderer créé');
    }

    render(container, weekData) {
        console.log('🏠 Rendu de la page d\'accueil', weekData);

        if (!weekData || !weekData.days) {
            console.error('❌ Données semaine invalides');
            container.innerHTML = '<p class="error">Données introuvables</p>';
            return;
        }

        console.log('📋 Données reçues:', weekData);

        const days = weekData.days;
        console.log('🗓️ Jours:', days);

        // HTML des cartes
        const cardsHTML = days.map(day => {
            const dayName = this.capitalize(day.day || day.name || 'Jour');
            const workoutName = day.name || 'Séance';
            const duration = day.duration || 0;
            const totalSets = day.totalSets || 0;

            return `
                <div class="day-card" data-day="${dayName.toLowerCase()}">
                    <div class="day-card-header">
                        <h3 class="day-name">${dayName}</h3>
                        <span class="day-badge">${workoutName}</span>
                    </div>
                    <div class="day-card-body">
                        <p class="workout-info">
                            ⏱️ ${duration} min · 💪 ${totalSets} séries
                        </p>
                    </div>
                    <button class="btn-start" data-day="${dayName.toLowerCase()}">
                        COMMENCER
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="home-container">
                <div class="week-header">
                    <h2>Semaine ${weekData.week || 1}</h2>
                </div>
                <div class="days-grid">
                    ${cardsHTML}
                </div>
            </div>
        `;

        console.log('✅ HTML injecté');

        // Attacher les event listeners
        this.attachEventListeners(container, weekData.week || 1);
    }

    attachEventListeners(container, week) {
        console.log('🔗 Attachement des event listeners...');
        
        const buttons = container.querySelectorAll('.btn-start');
        console.log('📍 4 boutons trouvés:', buttons.length);

        buttons.forEach(btn => {
            const day = btn.dataset.day;
            console.log(`✅ Listener attaché pour: ${day}`);
            
            btn.addEventListener('click', () => {
                console.log(`🎯 Clic sur bouton: ${day}`);
                this.handleDayClick(week, day);
            });
        });

        console.log('✅ Tous les event listeners attachés');
    }

    handleDayClick(week, day) {
        console.log(`🎯 handleDayClick appelé: week=${week}, day=${day}`);
        
        const dayData = {
            day: this.capitalize(day),
            name: this.getDayName(day),
            duration: 70,
            totalSets: 35,
            exercises: []
        };
        
        console.log('📦 Jour sélectionné:', dayData);

        // ✅ CORRECTION : Appeler le callback avec les bons paramètres
        if (this.onDaySelected && typeof this.onDaySelected === 'function') {
            console.log('✅ Appel du callback onDaySelected');
            this.onDaySelected(week, day);
        } else {
            console.error('❌ onDaySelected n\'est pas une fonction!');
        }
    }

    getDayName(day) {
        const names = {
            'dimanche': 'DOS + JAMBES LOURDES + BRAS',
            'mardi': 'PECS + ÉPAULES + TRICEPS',
            'vendredi': 'DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES',
            'maison': 'HAMMER CURL MAISON'
        };
        return names[day.toLowerCase()] || 'Séance';
    }

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

console.log('✅ HomeRenderer chargé');
