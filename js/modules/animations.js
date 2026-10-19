export const initAnimations = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS && !reducedMotion) {
    window.AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      offset: 55,
      once: true
    });
  } else {
    document.querySelectorAll('[data-aos]').forEach((element) => {
      element.removeAttribute('data-aos');
      element.removeAttribute('data-aos-delay');
    });
  }

  if (window.anime && !reducedMotion) {
    window.anime({
      targets: '.hero-content > *, .hero-visual',
      translateY: [22, 0],
      opacity: [0, 1],
      delay: window.anime.stagger(90),
      duration: 750,
      easing: 'easeOutCubic'
    });

    document.querySelectorAll('.fact-number[data-count]').forEach((element) => {
      const target = Number(element.dataset.count);
      const counter = { value: 0 };
      window.anime({
        targets: counter,
        value: target,
        round: 1,
        duration: 1200,
        delay: 350,
        easing: 'easeOutExpo',
        update: () => {
          element.textContent = String(counter.value).padStart(2, '0');
        }
      });
    });
  }
};