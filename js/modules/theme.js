const STORAGE_KEY = 'practica-cv-preferencias';

const readTheme = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.theme === 'light' ? 'light' : 'dark';
  } catch (error) {
    console.warn('No se pudo leer la preferencia de tema guardada.', error);
    return 'dark';
  }
};

const applyTheme = (theme, button) => {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#252320' : '#f2ede4');
  const icon = button.querySelector('i');
  if (icon) {
    icon.classList.toggle('ri-sun-line', isDark);
    icon.classList.toggle('ri-moon-line', !isDark);
  }
  button.setAttribute('aria-pressed', String(isDark));
  button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  button.title = isDark ? 'Cambiar al modo claro' : 'Cambiar al modo oscuro';
  document.dispatchEvent(new CustomEvent('cv-theme-change', { detail: { theme } }));
};

export const initTheme = () => {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  applyTheme(readTheme(), button);
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme, button);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema.', error);
    }
  });
};