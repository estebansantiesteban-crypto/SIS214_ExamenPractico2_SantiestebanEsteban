const getChartColors = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: styles.getPropertyValue('--accent').trim(),
    accentStrong: styles.getPropertyValue('--accent-strong').trim(),
    blue: styles.getPropertyValue('--blue').trim(),
    text: styles.getPropertyValue('--ink').trim(),
    muted: styles.getPropertyValue('--muted').trim(),
    line: styles.getPropertyValue('--line').trim()
  };
};

export const initSkillsChart = () => {
  const canvas = document.getElementById('skills-chart');
  const typeSelect = document.getElementById('skills-chart-type');
  const description = document.getElementById('skills-chart-description');
  if (!canvas || !typeSelect || !description) return;

  if (typeof window.Chart !== 'function') {
    description.textContent = 'El gráfico no está disponible porque Chart.js no se pudo cargar.';
    return;
  }

  const categories = [...document.querySelectorAll('.skill-card')].map((card) => ({
    label: card.querySelector('h3')?.textContent.trim() ?? 'Categoría',
    count: card.querySelectorAll('.tag-list li, .plain-list li').length
  }));
  if (categories.length === 0) {
    description.textContent = 'No hay categorías de habilidades para graficar.';
    return;
  }

  const colors = getChartColors();
  const chartColors = [colors.accent, colors.accentStrong, colors.blue];
  const getScaleOptions = (type, palette) => {
    if (type === 'radar') {
      return {
        r: {
          beginAtZero: true,
          ticks: { precision: 0, color: palette.muted, backdropColor: 'transparent' },
          grid: { color: palette.line },
          pointLabels: { color: palette.text }
        }
      };
    }
    if (type === 'doughnut') return {};

    return {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: palette.muted },
        grid: { color: palette.line }
      },
      y: {
        ticks: { color: palette.text },
        grid: { display: false }
      }
    };
  };
  const chart = new window.Chart(canvas, {
    type: typeSelect.value,
    data: {
      labels: categories.map(({ label }) => label),
      datasets: [{
        label: 'Elementos listados',
        data: categories.map(({ count }) => count),
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 2,
        borderRadius: typeSelect.value === 'bar' ? 6 : 0
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: {
          display: typeSelect.value !== 'bar',
          labels: { color: colors.text }
        },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.label}: ${context.raw} elementos`
          }
        }
      },
      scales: getScaleOptions(typeSelect.value, colors)
    }
  });

  const summary = categories.map(({ label, count }) => `${label}: ${count}`).join('; ');
  description.textContent = `Resumen accesible: ${summary} elementos listados.`;

  typeSelect.addEventListener('change', () => {
    const selectedType = typeSelect.value;
    chart.config.type = selectedType;
    chart.data.datasets[0].borderRadius = selectedType === 'bar' ? 6 : 0;
    chart.options.indexAxis = selectedType === 'bar' ? 'y' : 'x';
    chart.options.plugins.legend.display = selectedType !== 'bar';
    chart.options.scales = getScaleOptions(selectedType, getChartColors());
    chart.update();
  });

  document.addEventListener('cv-theme-change', () => {
    const nextColors = getChartColors();
    const nextPalette = [nextColors.accent, nextColors.accentStrong, nextColors.blue];
    chart.data.datasets[0].backgroundColor = nextPalette;
    chart.data.datasets[0].borderColor = nextPalette;
    chart.options.plugins.legend.labels.color = nextColors.text;
    chart.options.scales = getScaleOptions(chart.config.type, nextColors);
    chart.update();
  });
};