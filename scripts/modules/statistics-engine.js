// ============================================================================
// 📈 scripts/modules/statistics-engine.js
// Moteur de calcul des statistiques d'entraînement
// ============================================================================

class StatisticsEngine {
  constructor(programData) {
    this.programData = programData;
    this.history = this.loadHistory();
  }
  
  loadHistory() {
    const saved = localStorage.getItem('hybrid_master_history');
    return saved ? JSON.parse(saved) : this.createEmptyHistory();
  }
  
  createEmptyHistory() {
    const history = {};
    for (let week = 1; week <= 26; week++) {
      history[`week_${week}`] = {
        dimanche: { completed: false, volume: 0, exercises: [] },
        mardi: { completed: false, volume: 0, exercises: [] },
        vendredi: { completed: false, volume: 0, exercises: [] }
      };
    }
    return history;
  }
  
  saveHistory() {
    localStorage.setItem('hybrid_master_history', JSON.stringify(this.history));
  }
  
  // ==================== CALCULS VOLUME ====================
  
  calculateWeeklyVolume(week) {
    const weekData = this.history[`week_${week}`];
    if (!weekData) return 0;
    
    let total = 0;
    for (const day in weekData) {
      total += weekData[day].volume || 0;
    }
    return Math.round(total);
  }
  
  calculateTotalVolume() {
    let total = 0;
    for (const week in this.history) {
      total += this.calculateWeeklyVolume(parseInt(week.split('_')[1]));
    }
    return Math.round(total);
  }
  
  calculateAverageWeeklyVolume() {
    const completedWeeks = Object.keys(this.history).filter(week => {
      const weekData = this.history[week];
      return Object.values(weekData).some(day => day.completed);
    });
    
    if (completedWeeks.length === 0) return 0;
    
    const totalVolume = completedWeeks.reduce((sum, week) => {
      return sum + this.calculateWeeklyVolume(parseInt(week.split('_')[1]));
    }, 0);
    
    return Math.round(totalVolume / completedWeeks.length);
  }
  
  // ==================== CALCULS SÉANCES ====================
  
  calculateTotalSessions() {
    let count = 0;
    for (const week in this.history) {
      for (const day in this.history[week]) {
        if (this.history[week][day].completed) count++;
      }
    }
    return count;
  }
  
  getCompletionRate() {
    const total = 26 * 3; // 26 semaines × 3 séances
    const completed = this.calculateTotalSessions();
    return Math.round((completed / total) * 100);
  }
  
  getWeekCompletionRate(week) {
    const weekData = this.history[`week_${week}`];
    if (!weekData) return 0;
    
    const completed = Object.values(weekData).filter(d => d.completed).length;
    return Math.round((completed / 3) * 100);
  }
  
  // ==================== ANALYSE PAR MUSCLE ====================
  
  getVolumeByMuscleGroup() {
    const groups = {};
    
    for (const week in this.history) {
      for (const day in this.history[week]) {
        const dayData = this.history[week][day];
        if (dayData.exercises) {
          dayData.exercises.forEach(ex => {
            if (!groups[ex.muscleGroup]) {
              groups[ex.muscleGroup] = 0;
            }
            groups[ex.muscleGroup] += ex.volume || 0;
          });
        }
      }
    }
    
    return Object.entries(groups)
      .map(([name, value]) => ({ 
        name, 
        value: Math.round(value)
      }))
      .sort((a, b) => b.value - a.value);
  }
  
  // ==================== VUES GRAPHIQUES ====================
  
  // Heatmap : 7 derniers jours
  getLast7DaysMuscleMap() {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0,10);
      days.push({
        date: iso,
        muscles: ["pecs","dos"], // mock pour test
        sets: Math.floor(Math.random() * 10)
      });
    }
    return days;
  }
  
  // Radar chart : sets par muscle
  getSetCountPerMuscle(period = "30d") {
    const data = this.getVolumeByMuscleGroup();
    return {
      labels: data.map(d => d.name),
      datasets: [{
        label: "Sets par muscle",
        data: data.map(d => d.value),
        backgroundColor: "rgba(255, 107, 107, 0.4)",
        borderColor: "#ff6b6b"
      }]
    };
  }
  
  // Pie chart : répartition musculaire
  getMuscleDistribution(period = "30d") {
    const data = this.getVolumeByMuscleGroup();
    return {
      labels: data.map(d => d.name),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: ["#00d4aa","#ff6b6b","#1a1a2e","#ffa500","#4caf50"]
      }]
    };
  }
  
  // Top exercices
  getTopExercises(period = "30d") {
    const exercises = {};
    for (const week in this.history) {
      for (const day in this.history[week]) {
        const dayData = this.history[week][day];
        (dayData.exercises || []).forEach(ex => {
          if (!exercises[ex.name]) exercises[ex.name] = 0;
          exercises[ex.name]++;
        });
      }
    }
    return Object.entries(exercises)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0,10);
  }
  
  // ==================== UTILITAIRES ====================
  
  formatVolume(volume) {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}t`;
    }
    return `${volume}kg`;
  }
  
  refreshHistory() {
    this.history = this.loadHistory();
  }
}

// Export pour utilisation dans app.js
export { StatisticsEngine };
