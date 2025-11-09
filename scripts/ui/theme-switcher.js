/* ============================================
   THEME SWITCHER - DARK/LIGHT MODE
   ============================================ */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    // Appliquer le thème au démarrage
    this.applyTheme(this.currentTheme);
    
    // Créer le bouton toggle
    this.createToggleButton();
    
    // Écouter les changements du thème système
    this.watchSystemTheme();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    this.updateToggleIcon();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
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
      // Icône soleil pour passer en light
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // Icône lune pour passer en dark
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Si l'utilisateur n'a pas défini de préférence manuelle, suivre le système
      if (!localStorage.getItem('theme-user-override')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Style CSS pour le bouton (à ajouter dans votre CSS ou directement ici)
const style = document.createElement('style');
style.textContent = `
  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  }

  .theme-toggle:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-xl);
    background: var(--primary);
    color: white;
  }

  .theme-toggle:active {
    transform: translateY(0) scale(0.95);
  }

  .theme-toggle svg {
    transition: transform 0.3s ease;
  }

  .theme-toggle:hover svg {
    transform: rotate(20deg);
  }

  @media (max-width: 768px) {
    .theme-toggle {
      top: 10px;
      right: 10px;
      width: 44px;
      height: 44px;
    }
  }
`;
document.head.appendChild(style);

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeSwitcher());
} else {
  new ThemeSwitcher();
}

export default ThemeSwitcher;
