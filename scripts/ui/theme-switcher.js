/* ============================================
   THEME SWITCHER - Dark/Light Toggle
   ============================================ */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'dark';
    this.init();
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
    
    // Animation de feedback
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
      // Icône soleil (passer en light)
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
      // Icône lune (passer en dark)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

// Style CSS pour le bouton
const style = document.createElement('style');
style.textContent = `
  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--surface-color);
    backdrop-filter: blur(10px);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  }

  .theme-toggle:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    background: var(--primary-color);
    border-color: var(--primary-color);
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

  /* Responsive */
  @media (max-width: 768px) {
    .theme-toggle {
      top: 10px;
      right: 10px;
      width: 44px;
      height: 44px;
    }
  }

  @media (max-width: 390px) {
    .theme-toggle {
      width: 40px;
      height: 40px;
    }
    
    .theme-toggle svg {
      width: 18px;
      height: 18px;
    }
  }

  /* Animation d'apparition */
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .theme-toggle {
    animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
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
