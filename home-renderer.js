// modules/home-renderer.js
export class HomeRenderer {
  constructor(containerId = "homeRoot") {
    this.container = document.getElementById(containerId);
    this.storage = new LocalStorage();
    this.history = this.storage.load("history", {});
    this.week = this.storage.loadNavigationState().week;
    this.render();
  }

  render() {
    if (!this.container) return;

    const weekData = this.history[`week_${this.week}`];
    if (!weekData) {
      this.container.innerHTML = "<p>Aucune donnée pour cette semaine.</p>";
      return;
    }

    const days = Object.keys(weekData);
    this.container.innerHTML = `<h2>📅 Séances semaine ${this.week}</h2><div class="home-grid"></div>`;
    const grid = this.container.querySelector(".home-grid");

    days.forEach(day => {
      const session = weekData[day];
      const totalSets = session.exercises.reduce((sum, ex) => sum + (ex.sets || ex.reps || 0), 0);
      const card = document.createElement("div");
      card.className = "day-card";
      card.innerHTML = `
        <h4>${capitalize(day)}</h4>
        <p>${session.exercises[0]?.muscleGroup || "Séance personnalisée"}</p>
        <p>${session.exercises.length} exercices · ${totalSets} séries</p>
        <button data-day="${day}">Voir la séance</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        window.navigationManager.loadDay(this.week, day);
      });
      grid.appendChild(card);
    });
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
