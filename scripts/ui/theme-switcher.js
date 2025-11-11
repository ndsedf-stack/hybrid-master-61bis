export default class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'dark';
    this.toggleButton = null;
  }

  init() {
    // Appliquer le thème au démarrage
    this.applyTheme(this.currentTheme);

    // Créer le bouton toggle
    this.createToggleButton();
  }

  getStoredTheme() {
    return localStorage.getItem('hybrid-theme');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hybrid-theme', theme);
    this.currentTheme = theme;
    this.updateToggleIcon();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.animateToggle();
  }

  animateToggle() {
    if (this.toggleButton) {
      this.toggleButton.style.transform = 'rotate(360deg) scale(1.1)';
      setTimeout(() => {
        this.toggleButton.style.transform = '';
      }, 300);
    }
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.innerHTML = this.getIcon(this.currentTheme);

    button.addEventListener('click', () => this.toggleTheme());

    document.body.appendChild(button);
    this.toggleButton = button;
  }

  updateToggleIcon() {
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.getIcon(this.currentTheme);
    }
  }

  getIcon(theme) {
    if (theme === 'dark') {
      return `<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>`;
    }
  }
}
