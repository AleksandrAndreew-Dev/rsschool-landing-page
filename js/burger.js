document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector(
    '.header__burger',
  );
  const modal = document.querySelector('.burger__modal');
  const closeBtn = document.querySelector('.burger__close');

  const openModal = () => {
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.hidden = true;
      }
    }, 300);
  };

  burgerBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      modal.classList.contains('is-open')
    ) {
      closeModal();
    }
  });

  modal
    .querySelectorAll('.burger__link')
    .forEach((link) => {
      link.addEventListener('click', closeModal);
    });
});
