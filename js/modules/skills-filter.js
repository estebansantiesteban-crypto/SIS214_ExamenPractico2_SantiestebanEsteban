export const initSkillsFilter = () => {
  const input = document.getElementById('busqueda-habilidades');
  const list = document.querySelector('.skills-grid');
  const status = document.getElementById('estado-busqueda-habilidades');
  if (!input || !list || !status) return;

  const skills = Object.freeze(
    [...list.querySelectorAll('.tag-list li, .plain-list li')].map((element) =>
      Object.freeze({
        element,
        card: element.closest('.skill-card'),
        text: element.textContent.trim().toLocaleLowerCase('es')
      })
    )
  );
  const cards = Object.freeze([...list.querySelectorAll('.skill-card')]);
  const updateFilter = () => {
    const query = input.value.trim().toLocaleLowerCase('es');
    const matchingSkills = skills.filter(({ text }) => text.includes(query));
    const matchingElements = new Set(matchingSkills.map(({ element }) => element));
    const matchingCards = new Set(matchingSkills.map(({ card }) => card));

    skills
      .filter(({ element }) => !matchingElements.has(element))
      .map(({ element }) => {
        element.hidden = true;
        return element;
      });
    matchingSkills.map(({ element }) => {
      element.hidden = false;
      return element;
    });
    cards.map((card) => {
      card.hidden = query !== '' && !matchingCards.has(card);
      return card;
    });

    status.textContent = query
      ? `${matchingSkills.length} ${matchingSkills.length === 1 ? 'habilidad encontrada' : 'habilidades encontradas'}.`
      : '';
  };
  const lodashDebounce = window._?.debounce;

  if (typeof lodashDebounce !== 'function') {
    console.warn('Lodash no está disponible; el filtro de habilidades se ejecutará sin debounce.');
  }

  input.addEventListener('input', typeof lodashDebounce === 'function'
    ? lodashDebounce(updateFilter, 180)
    : updateFilter);
};