(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll(
    '.theme-switch__btn',
  );
  const applyTheme = (theme) => {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(
        '[theme] Неверное значение темы:',
        theme,
      );
      return;
    }
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.log(error);
    }

    buttons.forEach((btn) => {
      const isActive = btn.dataset.themeValue === theme;
      btn.classList.toggle(
        'theme-switch__btn--active',
        isActive,
      );
      btn.setAttribute(
        'aria-pressed',
        isActive ? 'true' : 'false',
      );
    });
  };

  const current =
    root.getAttribute('data-theme') || 'light';

  applyTheme(current);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeValue);
    });
  });
})();
