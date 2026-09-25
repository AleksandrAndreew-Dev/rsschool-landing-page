document.addEventListener('DOMContentLoaded', async () => {
  const req = await fetch('./data/slider.json');
  const sliderProducts = await req.json();

  const container = document.querySelector('.slider__row');
  const nextBtn = document.querySelector(
    '.slider__btn--next',
  );
  const prevBtn = document.querySelector(
    '.slider__btn--prev',
  );

  const currentControl =
    document.querySelectorAll('.slider__dot');
  let index = 0;

  function renderSlide(index) {
    const product = sliderProducts[index];
    container.innerHTML = `
      <article class="slide"><img src="./img/coffee-slider-${index + 1}.png"
                                                 alt="${product.name}"
                                                 class="slide__image">
                                            <div class="slide__info">
                                                  <h3 class="slide__name">${product.name}</h3>
                                                  <p class="slide__desc">${product.description}</p>
                                                  <span class="slide__price">$${product.price}</span>
                                            </div>
                                      </article>`;
    currentControl.forEach((control, i) => {
      control.classList.toggle(
        'slider__dot--active',
        i === index,
      );
    });
  }

  function goNext(delta) {
    index =
      (index + delta + sliderProducts.length) %
      sliderProducts.length;
    currentControl.forEach((control) =>
      control.classList.remove('slider__dot--active'),
    );
    currentControl[index].classList.add(
      'slider__dot--active',
    );
    renderSlide(index);
  }

  nextBtn.addEventListener('click', () => goNext(1));

  prevBtn.addEventListener('click', () => goNext(-1));

  renderSlide(index);
});
