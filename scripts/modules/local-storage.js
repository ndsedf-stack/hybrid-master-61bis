// modules/local-storage.js
export class LocalStorage {
  // Charger une valeur depuis localStorage
  load(key, defaultValue = {}) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  // Sauvegarder une valeur dans localStorage
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Charger l'état de navigation (par défaut semaine 1)
  loadNavigationState() {
    return this.load("navigationState", { week: 1 });
  }

  // Sauvegarder l'état de navigation
  saveNavigationState(state) {
    this.save("navigationState", state);
  }
}
