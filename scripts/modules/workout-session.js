export default class WorkoutSession {
  constructor() {
    this.currentWorkout = null;
    this.completedSets = new Map();
    this.startTime = null;
    this.endTime = null;
  }

  init() {
    console.log('🎯 Session initialisée');
    const restored = this.loadFromStorage();
    if (restored && restored.currentWorkout) {
      this.startWorkout(restored.currentWorkout, true);
    }
  }

  startWorkout(workoutData, isRestored = false) {
    this.currentWorkout = workoutData;
    this.startTime = isRestored ? this.startTime : new Date();
    if (!isRestored) this.completedSets.clear();
    console.log(`${isRestored ? '📥' : '💪'} Séance ${isRestored ? 'restaurée' : 'démarrée'} :`, workoutData);
  }

  markSetCompleted(exerciseId, setNumber, isCompleted) {
    if (!this.completedSets.has(exerciseId)) {
      this.completedSets.set(exerciseId, new Set());
    }
    const sets = this.completedSets.get(exerciseId);
    if (isCompleted) {
      sets.add(setNumber);
    } else {
      sets.delete(setNumber);
    }
    this.saveToStorage();
  }

  isSetCompleted(exerciseId, setNumber) {
    return this.completedSets.has(exerciseId) && this.completedSets.get(exerciseId).has(setNumber);
  }

  getCompletedSetsCount(exerciseId) {
    return this.completedSets.has(exerciseId) ? this.completedSets.get(exerciseId).size : 0;
  }

  endWorkout() {
    this.endTime = new Date();
    const duration = (this.endTime - this.startTime) / 1000 / 60;
    this.saveToStorage();
    return this.getSessionSummary();
  }

  getSessionSummary() {
    return {
      duration: this.endTime ? (this.endTime - this.startTime) / 1000 / 60 : null,
      completedExercises: this.completedSets.size,
      totalSets: Array.from(this.completedSets.values()).reduce((sum, sets) => sum + sets.size, 0)
    };
  }

  saveToStorage() {
    try {
      const data = {
        completedSets: Array.from(this.completedSets.entries()).map(([key, value]) => [key, Array.from(value)]),
        startTime: this.startTime,
        currentWorkout: this.currentWorkout
      };
      localStorage.setItem('workout-session', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder la session :', error);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('workout-session');
      if (!stored) return null;
      const data = JSON.parse(stored);
      if (!data || !data.completedSets) return null;

      this.completedSets = new Map(
        data.completedSets.map(([key, value]) => [key, new Set(value)])
      );
      this.startTime = data.startTime ? new Date(data.startTime) : null;
      this.currentWorkout = data.currentWorkout;

      return data;
    } catch (error) {
      console.warn('⚠️ Impossible de charger la session :', error);
      return null;
    }
  }

  reset() {
    this.completedSets.clear();
    this.currentWorkout = null;
    this.startTime = null;
    this.endTime = null;
    try {
      localStorage.removeItem('workout-session');
    } catch (error) {
      console.warn('⚠️ Impossible de supprimer la session :', error);
    }
    console.log('🔄 Session réinitialisée');
  }
}
