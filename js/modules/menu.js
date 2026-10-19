export const initMenu = () => {
  const button = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-principal');
  if (!button || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(({ section }) => section);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) =>
          Math.abs(a.boundingClientRect.top - window.innerHeight * 0.3) -
          Math.abs(b.boundingClientRect.top - window.innerHeight * 0.3)
        )[0]?.target;

      sectionLinks.forEach(({ link }) => link.removeAttribute('aria-current'));
      const currentLink = sectionLinks.find(({ section }) => section === visibleSection)?.link;
      currentLink?.setAttribute('aria-current', 'location');
    }, { rootMargin: '-15% 0px -65% 0px' });

    sectionLinks.forEach(({ section }) => sectionObserver.observe(section));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', () => setOpen(false));
};