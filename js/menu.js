console.log('menu.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetch('./data/products.json');
  const products = await data.json();

  console.log(products);

  const menuContainer =
    document.querySelector('.menu__grid');

  const tabs = document.querySelectorAll('.menu__tab');
  tabs.forEach((tab) =>
    tab.addEventListener('click', handleTabClick),
  );

  const selectedTag = document.querySelector(
    '.menu__tab--active',
  );

  console.log(selectedTag);

  const selectedCategory = selectedTag?.dataset.category;
  console.log(selectedCategory);
  menuContainer.innerHTML = '';
  products
    .filter(
      (product) => product.category === selectedCategory,
    )
    .forEach((product, index) =>
      menuContainer.append(
        createMenuItem(product, selectedCategory, index),
      ),
    );

  function handleTabClick(event) {
    tabs.forEach((tab) =>
      tab.classList.remove('menu__tab--active'),
    );
    const clickedTab = event.target.closest('.menu__tab');
    clickedTab?.classList.add('menu__tab--active');
    renderMenu(clickedTab.dataset.category);
  }

  function renderMenu(category) {
    menuContainer.innerHTML = '';
    products
      .filter((product) => product.category === category)
      .forEach((product, index) =>
        menuContainer.append(
          createMenuItem(product, category, index),
        ),
      );
  }
});

function createMenuItem(product, category, index) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.dataset.category = category;
  card.dataset.index = index;

  const template = `<img class="card__image"
    src="./img/${category}-${index + 1}.png"
    alt="${product.name}">
    <div class="card__info">
          <h2 class="card__name">${product.name}</h2>
          <p class="card__desc">${product.description}</p>
          <span class="card__price">$${product.price}</span>
    </div>
    `;
  card.innerHTML = template;
  card.addEventListener('click', () =>
    openProductModal(product, category, index),
  );
  return card;
}

function openProductModal(product, category, index) {
  const modal = document.querySelector('.modal');
  const modalCard = document.querySelector('.modal__card');
  const img = document.querySelector('.modal__card > img');
  img.src = `./img/${category}-${index + 1}.png`;
  img.alt = product.name;
  modal.querySelector('.modal__header h3').textContent =
    product.name;
  modal.querySelector('.modal__header p').textContent =
    product.description;

  const sizesList = document.querySelector(
    '.modal_sizes ul',
  );
  sizesList.innerHTML = Object.entries(product.sizes)
    .map(
      ([key, val], i) => `
<li class="${i === 0 ? 'is-active' : ''}" data-size="${key}">
      <span class="modal__content-rounded">${key.toUpperCase()}</span>
      ${val.size}
</li>
    `,
    )
    .join('');

  const additiveList = document.querySelector(
    '.modal_additives ul',
  );
  additiveList.innerHTML = product.additives
    .map(
      (a, i) => `
      <li data-additive="${i}"><span class="modal__content-rounded">${i + 1}</span>${a.name}</li>
  `,
    )
    .join('');
  modal.querySelector('.modal__total p').textContent =
    `$${product.price}`;

  modal.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
  });
  document.body.classList.add('is-locked');
  modal.__product = product;
}

function initModal() {
  const modal = document.querySelector('.modal');
  if (!modal) return;

  const closeBtn = modal.querySelector(
    '.modal__content-5rows > button',
  );

  const close = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => {
      if (!modal.classList.contains('is-open'))
        modal.hidden = true;
    }, 300);
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      modal.classList.contains('is-open')
    )
      close();
  });

  // Выбор размера
  modal.addEventListener('click', (e) => {
    const sizeLi = e.target.closest('.modal_sizes li');
    if (sizeLi) {
      modal
        .querySelectorAll('.modal_sizes li')
        .forEach((li) => li.classList.remove('is-active'));
      sizeLi.classList.add('is-active');
      recalcTotal(modal);
      return;
    }

    const addLi = e.target.closest('.modal_additives li');
    if (addLi) {
      addLi.classList.toggle('is-active');
      recalcTotal(modal);
    }
  });
}

document.addEventListener('DOMContentLoaded', initModal);

function recalcTotal(modal) {
  // базовую цену и данные продукта можно хранить в modal.dataset или замыкании
  // проще: положить product в modal.__product при открытии
  const product = modal.__product;
  if (!product) return;

  let total = parseFloat(product.price);

  const activeSize = modal.querySelector(
    '.modal_sizes li.is-active',
  );
  if (activeSize) {
    const sizeKey = activeSize.dataset.size;
    total += parseFloat(
      product.sizes[sizeKey]['add-price'],
    );
  }

  modal
    .querySelectorAll('.modal_additives li.is-active')
    .forEach((li) => {
      const i = +li.dataset.additive;
      total += parseFloat(
        product.additives[i]['add-price'],
      );
    });

  modal.querySelector('.modal__total p').textContent =
    `$${total.toFixed(2)}`;
}
