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
      <section id="progression-8weeks" class="section-card">
        <h3>Progression sur 8 semaines</h3>
        <div class="legend">
          <span class="legend-pill"><span class="dot" style="background:#00d4aa"></span> Volume</span>
          <span class="legend-pill"><span class="dot" style="background:#ff6b35"></span> Séances</span>
          <span class="legend-pill"><span class="dot" style="background:#3aa0ff"></span> Complétion</span>
        </div>
        <div class="chart-wrap"><canvas id="progressionChart"></canvas></div>
      </section>
      <section id="heatmap" class="section-card">
        <h3>Activité des 7 derniers jours</h3>
        <div class="heatmap-grid"></div>
      </section>
      <section id="radar" class="section-card">
        <h3>Sets par muscle (Radar)</h3>
        <div class="chart-wrap"><canvas id="radarChart"></canvas></div>
      </section>
      <section id="pie" class="section-card">
        <h3>Répartition musculaire</h3>
        <div class="chart-wrap"><canvas id="pieChart"></canvas></div>
      </section>
      <section id="top-exercises" class="section-card">
        <h3>Top exercices</h3>
        <ul class="top-exercises"></ul>
      </section>
      <section id="records" class="section-card">
        <h3>Records personnels</h3>
        <ul class="records-list"></ul>
      </section>
    `;

    this.renderSummaryGlobal();
    this.renderProgression8Weeks();
    this.renderHeatmap();
    this.renderRadar();
    this.renderPie();
    this.renderTopExercises();
    this.renderRecords();
  }

  renderSummaryGlobal() {
    const section = this.container.querySelector("#summary-global");

    const volumeTotal = this.engine.calculateTotalVolume();
    const volumeMoyen = this.engine.calculateAverageWeeklyVolume();
    const totalSessions = this.engine.calculateTotalSessions();
    const completionRate = this.engine.getCompletionRate();
    const avgDuration = this.engine.getAverageSessionDuration();
    const growthRate = this.engine.getVolumeGrowthRate();

    section.innerHTML = `
      <div class="summary-card"><div class="summary-icon">🏋️</div><div class="summary-value">${this.engine.formatVolume(volumeTotal)}</div><div class="summary-label">Volume total</div></div>
      <div class="summary-card"><div class="summary-icon">📈</div><div class="summary-value">${this.engine.formatVolume(volumeMoyen)}</div><div class="summary-label">Volume hebdo moyen</div></div>
      <div class="summary-card"><div class="summary-icon">✅</div><div class="summary-value">${totalSessions}</div><div class="summary-label">Séances totales</div></div>
      <div class="summary-card"><div class="summary-icon">🔥</div><div class="summary-value">${completionRate}%</div><div class="summary-label">Taux de complétion</div></div>
      <div class="summary-card"><div class="summary-icon">⏱️</div><div class="summary-value">${avgDuration} min</div><div class="summary-label">Durée moyenne</div></div>
      <div class="summary-card"><div class="summary-icon">📊</div><div class="summary-value">${growthRate}%</div><div class="summary-label">Croissance du volume</div></div>
    `;
  }

  renderProgression8Weeks() {
    const data = this.engine.getProgressionData(8);
    const ctx = this.container.querySelector("#progressionChart")?.getContext("2d");

    if (!data || !data.length || !ctx || typeof Chart === "undefined") return;

    const labels = data.map(d => d.week);
    const volumes = data.map(d => d.volume);
    const sessions = data.map(d => d.sessions);
    const completionRates = data.map(d => d.completionRate);

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Volume (kg)",
            data: volumes,
            borderColor: "#00d4aa",
            backgroundColor: "rgba(0,212,170,0.15)",
            tension: 0.3,
            fill: true,
            yAxisID: "y"
          },
          {
            label: "Séances",
            data: sessions,
            borderColor: "#ff6b35",
            backgroundColor: "rgba(255,107,53,0.15)",
            tension: 0.3,
            fill: true,
            yAxisID: "y1"
          },
          {
            label: "Complétion (%)",
            data: completionRates,
            borderColor: "#3aa0ff",
            backgroundColor: "rgba(58,160,255,0.12)",
            tension: 0.3,
            fill: true,
            yAxisID: "y2"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { position: "left", ticks: { color: "#9aa7b2" }, grid: { color: "#152133" } },
          y1: { position: "right", ticks: { color: "#ff6b35" }, grid: { drawOnChartArea: false } },
          y2: { position: "right", ticks: { color: "#3aa0ff" }, grid: { drawOnChartArea: false }, min: 0, max: 100 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0c1218",
            borderColor: "#1e2733",
            borderWidth: 1,
            titleColor: "#e8edf2",
            bodyColor: "#9aa7b2",
            padding: 12
          }
        }
      }
    });
  }

  renderHeatmap() {
    const data = this.engine.getLast7DaysMuscleMap();
    const grid = this.container.querySelector(".heatmap-grid");
    if (!data || !data.length || !grid) return;

    grid.innerHTML = "";
    data.forEach(d => {
      const cell = document.createElement("div");
      cell.className = "day";
      cell.textContent = d.date.slice(5);
      if (d.muscles.length) cell.classList.add("active");
      grid.appendChild(cell);
    });
  }

  renderRadar() {
    const data = this.engine.getSetCountPerMuscle();
    const ctx = this.container.querySelector("#radarChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

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

  renderPie() {
    const data = this.engine.getMuscleDistribution();
    const ctx = this.container.querySelector("#pieChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

    data.datasets[0].backgroundColor = ["#00d4aa", "#3aa0ff", "#ff6b35", "#8f5fff"];
    new Chart(ctx, {
      type: "doughnut",
      data,
      options: {
        responsive: true,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#e8edf2", padding: 16, boxWidth: 12 }
          }
        }
      }
    });
  }

    renderTopExercises() {
    const list = this.engine.getTopExercises();
    const ul = this.container.querySelector(".top-exercises");
    if (!list || !list.length || !ul) return;

    ul.innerHTML = "";
    list.forEach(ex => {
      const li = document.createElement("li");
      li.textContent = `${ex.name} (${ex.count})`;
      ul.appendChild(li);
    });
  }

  // ==================== RECORDS PERSONNELS ====================
  renderRecords() {
    const records = this.engine.getPersonalRecords();
    const ul = this.container.querySelector(".records-list");
    if (!records || !records.length || !ul) {
      ul.innerHTML = "<li class='empty'>Aucun record enregistré</li>";
      return;
    }

    ul.innerHTML = "";
    records.forEach(rec => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${rec.name}</strong><br>
        <span class="record-line">Poids max : <b>${rec.maxWeight} kg</b></span><br>
        <span class="record-line">Reps max : <b>${rec.maxReps}</b></span><br>
        <span class="record-line">Volume max : <b>${rec.maxVolume} kg</b></span>
      `;
      ul.appendChild(li);
    });
  }
}
