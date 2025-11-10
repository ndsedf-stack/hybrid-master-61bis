/**
 * LOCAL STORAGE - Gestion de la persistance des données
 */

export class LocalStorage {
    constructor() {
        this.prefix = 'hybrid_master_';
        this.available = this.checkAvailability();
    }

    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ localStorage non disponible:', e);
            return false;
        }
    }

    save(key, value) {
        if (!this.available) return false;
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('❌ Erreur lors de la sauvegarde:', e);
            return false;
        }
    }

    load(key, defaultValue = null) {
        if (!this.available) return defaultValue;
        try {
            const fullKey = this.prefix + key;
            const jsonValue = localStorage.getItem(fullKey);
            return jsonValue ? JSON.parse(jsonValue) : defaultValue;
        } catch (e) {
            console.error('❌ Erreur lors du chargement:', e);
            return defaultValue;
        }
    }

    remove(key) {
        if (!this.available) return false;
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error('❌ Erreur lors de la suppression:', e);
            return false;
        }
    }

    clear() {
        if (!this.available) return false;
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) localStorage.removeItem(key);
            });
            console.log('🗑️ Données effacées');
            return true;
        } catch (e) {
            console.error('❌ Erreur lors de l\'effacement:', e);
            return false;
        }
    }

    // ==================== DONNÉES DE TEST ====================
    saveFakeHistory() {
        const fakeHistory = {};
        for (let week = 24; week <= 26; week++) {
            fakeHistory[`week_${week}`] = {
                dimanche: {
                    completed: true,
                    volume: 3200 + week * 100,
                    duration: 45,
                    exercises: [
                        { name: "Squat", weight: 100 + week, reps: 10, volume: (100 + week) * 10, muscleGroup: "Jambes" },
                        { name: "Bench Press", weight: 80 + week, reps: 8, volume: (80 + week) * 8, muscleGroup: "Pectoraux" }
                    ]
                },
                mardi: {
                    completed: true,
                    volume: 2800 + week * 80,
                    duration: 40,
                    exercises: [
                        { name: "Deadlift", weight: 120 + week, reps: 6, volume: (120 + week) * 6, muscleGroup: "Dos" },
                        { name: "Pull-Up", weight: 0, reps: 12, volume: 0, muscleGroup: "Dos" }
                    ]
                },
                vendredi: {
                    completed: true,
                    volume: 3000 + week * 90,
                    duration: 50,
                    exercises: [
                        { name: "Overhead Press", weight: 60 + week, reps: 10, volume: (60 + week) * 10, muscleGroup: "Épaules" },
                        { name: "Rowing", weight: 70 + week, reps: 10, volume: (70 + week) * 10, muscleGroup: "Dos" }
                    ]
                }
            };
        }
        this.save("history", fakeHistory);
        console.log("✅ Données de test injectées (semaines 24–26)");
    }

    // ==================== NAVIGATION ====================
    saveNavigationState(week, day) {
        return this.save('navigation', { week, day });
    }
    loadNavigationState() {
        return this.load('navigation', { week: 1, day: 'dimanche' });
    }

    // ==================== PROGRESSION EXERCICES ====================
    saveExerciseProgress(week, day, exerciseId, data) {
        return this.save(`progress_w${week}_${day}_${exerciseId}`, data);
    }
    loadExerciseProgress(week, day, exerciseId) {
        return this.load(`progress_w${week}_${day}_${exerciseId}`, null);
    }
    saveCompletedSets(week, day, exerciseId, completedSets) {
        return this.saveExerciseProgress(week, day, exerciseId, {
            completedSets,
            lastUpdate: new Date().toISOString()
        });
    }
    loadCompletedSets(week, day, exerciseId) {
        const data = this.loadExerciseProgress(week, day, exerciseId);
        return data ? data.completedSets : [];
    }
    saveCustomWeights(week, day, exerciseId, weights) {
        return this.save(`weights_w${week}_${day}_${exerciseId}`, {
            weights,
            lastUpdate: new Date().toISOString()
        });
    }
    loadCustomWeights(week, day, exerciseId) {
        const data = this.load(`weights_w${week}_${day}_${exerciseId}`, null);
        return data ? data.weights : null;
    }

    // ==================== TIMER ====================
    saveTimerState(seconds, isRunning) {
        return this.save('timer', { seconds, isRunning, timestamp: Date.now() });
    }
    loadTimerState() {
        const data = this.load('timer', null);
        if (data && (Date.now() - data.timestamp) > 3600000) return null;
        return data;
    }

    // ==================== EXPORT / IMPORT ====================
    exportAll() {
        if (!this.available) return null;
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                data[key.replace(this.prefix, '')] = localStorage.getItem(key);
            }
        });
        return data;
    }
    importAll(data) {
        if (!this.available || !data) return false;
        try {
            Object.keys(data).forEach(key => {
                localStorage.setItem(this.prefix + key, data[key]);
            });
            console.log('✅ Données importées');
            return true;
        } catch (e) {
            console.error('❌ Erreur lors de l\'import:', e);
            return false;
        }
    }
    getStorageSize() {
        if (!this.available) return 0;
        let size = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) size += localStorage.getItem(key).length;
        });
        return size;
    }
    getStorageSizeFormatted() {
        return `${(this.getStorageSize() / 1024).toFixed(2)} Ko`;
    }
}

// ✅ Expose la classe en global pour la console
window.LocalStorage = LocalStorage;
