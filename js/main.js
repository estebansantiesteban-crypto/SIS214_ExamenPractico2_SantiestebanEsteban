import { initTheme } from './modules/theme.js';
import { initMenu } from './modules/menu.js';
import { initForm } from './modules/form.js';
import { initAnimations } from './modules/animations.js';
import { initSkillsFilter } from './modules/skills-filter.js';
import { initSkillsChart } from './modules/skills-chart.js';
import { initWeather } from './modules/weather.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMenu();
  initForm();
  initSkillsFilter();
  initSkillsChart();
  initAnimations();
  initWeather();

  document.getElementById('print-cv')?.addEventListener('click', () => window.print());

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
});