/**
 * theme.js – Controle de tema claro/escuro
 * THINK Corporation
 *
 * Funções:
 *  - Lê preferência salva no LocalStorage
 *  - Aplica tema ao <html data-theme>
 *  - Atualiza ícone do botão (☀️ / 🌙)
 *  - Salva nova preferência ao clicar
 */

(function () {
  'use strict';

  // ── Chave de armazenamento ──
  const STORAGE_KEY = 'think-theme';
  const DEFAULT_THEME = 'dark';

  /**
   * Retorna o tema salvo ou o padrão.
   * @returns {'dark'|'light'}
   */
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  /**
   * Aplica o tema ao documento e atualiza o botão.
   * @param {'dark'|'light'} theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Atualiza ícone (o botão pode ainda não estar no DOM ao carregar,
    // pois o header é injetado dinamicamente – verificamos com segurança)
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Aria-label acessível
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark'
          ? 'Alternar para tema claro'
          : 'Alternar para tema escuro'
      );
    }
  }

  /**
   * Alterna entre dark e light e persiste no LocalStorage.
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // ── Inicialização: aplica tema assim que o script carrega ──
  applyTheme(getSavedTheme());

  // ── Registra listener no botão quando o DOM estiver pronto ──
  // Usamos delegação de eventos no document para capturar o botão
  // mesmo após injeção dinâmica do header.
  document.addEventListener('click', function (e) {
    if (e.target.closest('#themeToggle')) {
      toggleTheme();

      // Animação sutil no ícone
      const icon = document.getElementById('themeIcon');
      if (icon) {
        icon.style.transform = 'scale(1.4) rotate(20deg)';
        setTimeout(() => (icon.style.transform = ''), 300);
      }
    }
  });

  // ── Expõe globalmente (útil para debug/testes) ──
  window.ThinkTheme = { apply: applyTheme, toggle: toggleTheme, getTheme: getSavedTheme };
})();
