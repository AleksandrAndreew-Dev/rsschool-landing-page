console.log('menu.js loaded');



document.addEventListener('DOMContentLoaded', async () => {

const data = await fetch('./data/products.json');
const products = await data.json()


console.log(products);

const menuContainer = document.querySelector('.menu__grid');

const tabs = document.querySelectorAll('.menu__tab');
tabs.forEach(tab => tab.addEventListener('click', handleTabClick));

const selectedTag = document.querySelector('.menu__tab--active');

console.log(selectedTag);

const selectedCategory = selectedTag?.dataset.category;
console.log(selectedCategory);
menuContainer.innerHTML = '';
products.filter(product => product.category === selectedCategory).forEach((product, index) =>
      menuContainer.append(createMenuItem(product, selectedCategory, index)));



function handleTabClick(event) {
      tabs.forEach(tab => tab.classList.remove('menu__tab--active'));
      const clickedTab = event.target.closest('.menu__tab');
      clickedTab?.classList.add('menu__tab--active');
      renderMenu(clickedTab.dataset.category);
}


function renderMenu(category) {
      menuContainer.innerHTML = '';
      products.filter(product => product.category === category)
            .forEach((product, index) => menuContainer.append(createMenuItem(product, category, index)));


}
})



function createMenuItem(product, category, index) {
    let card = document.createElement('article');
    card.classList.add('card');
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
    return card;
}
