// ==================================
// STATISTICS UI
// ==================================
// Gère l'affichage du suivi des statistiques utilisateur.

import { StatisticsEngine } from "../modules/statistics-engine.js";

export class StatisticsUI {
  constructor(containerId = "statsRoot", sessions = []) {
    this.container = document.getElementById(containerId);
    this.engine = new StatisticsEngine(sessions);
    this.render();
  }

  render() {
    if (!this.container) {
      console.warn("⚠️ Container des statistiques introuvable");
      return;
    }

    this.container.innerHTML = `
      <h2>📊 Statistiques</h2>
      <section id="summary-global" class="weekly-summary"></section>
      <section id="heatmap"></section>
      <section id="radar"></section>
      <section id="pie"></section>
      <section id="top-exercises"></section>
    `;

    this.renderSummaryGlobal();
    this.renderHeatmap();
    this.renderRadar();
    this.renderPie();
    this.renderTopExercises();
  }

  // ==================== RÉSUMÉ GLOBAL ====================
  renderSummaryGlobal() {
    const section = this.container.querySelector("#summary-global");

    const volumeTotal = this.engine.calculateTotalVolume();
    const volumeMoyen = this.engine.calculateAverageWeeklyVolume();
    const totalSessions = this.engine.calculateTotalSessions();
    const completionRate = this.engine.getCompletionRate();
    const avgDuration = this.engine.getAverageSessionDuration();
    const growthRate = this.engine.getVolumeGrowthRate();

    section.innerHTML = `
      <div class="summary-card">
        <div class="summary-icon">🏋️</div>
        <div class="summary-value">${this.engine.formatVolume(volumeTotal)}</div>
        <div class="summary-label">Volume total</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📈</div>
        <div class="summary-value">${this.engine.formatVolume(volumeMoyen)}</div>
        <div class="summary-label">Volume hebdo moyen</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">✅</div>
        <div class="summary-value">${totalSessions}</div>
        <div class="summary-label">Séances totales</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">🔥</div>
        <div class="summary-value">${completionRate}%</div>
        <div class="summary-label">Taux de complétion</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">⏱️</div>
        <div class="summary-value">${avgDuration} min</div>
        <div class="summary-label">Durée moyenne</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📊</div>
        <div class="summary-value">${growthRate}%</div>
        <div class="summary-label">Croissance du volume</div>
      </div>
    `;
  }

  // ==================== HEATMAP ====================
  renderHeatmap() {
    const data = this.engine.getLast7DaysMuscleMap();
    const section = this.container.querySelector("#heatmap");
    section.innerHTML = `<h3>Last 7 Days Body Graph</h3><div class="heatmap-grid"></div>`;
    const grid = section.querySelector(".heatmap-grid");

    if (!data || !data.length) {
      grid.innerHTML = "<p>Aucune donnée disponible</p>";
      return;
    }

    data.forEach(d => {
      const cell = document.createElement("div");
      cell.className = "day " + (d.muscles.length ? "active" : "");
      cell.textContent = d.date.slice(5); // affiche MM-DD
      grid.appendChild(cell);
    });
  }

  // ==================== RADAR CHART ====================
  renderRadar() {
    const data = this.engine.getSetCountPerMuscle();
    const section = this.container.querySelector("#radar");
    section.innerHTML = `<h3>Sets par muscle (Radar)</h3><canvas id="radarChart"></canvas>`;
    const ctx = section.querySelector("#radarChart")?.getContext("2d");

    if (ctx && typeof Chart !== "undefined") {
      new Chart(ctx, {
        type: "radar",
        data,
        options: {
          responsive: true,
          scales: {
            r: {
              angleLines: { color: "#444" },
              grid: { color: "#666" },
              pointLabels: { color: "#fff" }
            }
          }
        }
      });
    }
  }

  // ==================== PIE CHART ====================
  renderPie() {
    const data = this.engine.getMuscleDistribution();
    const section = this.container.querySelector("#pie");
    section.innerHTML = `<h3>Répartition musculaire</h3><canvas id="pieChart"></canvas>`;
    const ctx = section.querySelector("#pieChart")?.getContext("2d");

    if (ctx && typeof Chart !== "undefined") {
      new Chart(ctx, {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: "#fff" } }
          }
        }
      });
    }
  }

  // ==================== TOP EXERCICES ====================
  renderTopExercises() {
    const list = this.engine.getTopExercises();
    const section = this.container.querySelector("#top-exercises");
    section.innerHTML = `<h3>Top exercices</h3><ul class="top-exercises"></ul>`;
    const ul = section.querySelector("ul");

    if (!list || !list.length) {
      ul.innerHTML = "<li>Aucun exercice enregistré</li>";
      return;
    }

    list.forEach(ex => {
      const li = document.createElement("li");
      li.textContent = `${ex.name} (${ex.count})`;
      ul.appendChild(li);
    });
  }
}
