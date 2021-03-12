'use strict';

let commonProduct = { // общий прототип продукта
    name: '', // название
    code: 0, // артикул
    category: '', // категория товара
    price: 0, // розничная цена
    businessPrice: 0, // оптовая цена
    stock: 10, // остаток на складе
    available: true, // доступность к покупке
    image: '', // ссылка на основную картинку
    secImages: [], // массив ссылок на доп. картинки
    description: '', // описание товара
    discount: 0, // скидка (по умолчанию - 0%)
    amount: 0, // кол-во в корзине
    actionPrice: function () { // подсчёт акционной цены (со скидкой)
        return this.price / 100 * (100 - this.discount)
    }

};

function CreateProduct(product) { // создание продукта с основными свойствами
    this.name = product.name;
    this.code = product.code;
    this.price = product.price;
    this.image = product.image;
};

CreateProduct.prototype = commonProduct;

let basket = { // объект корзины
    items: [], // массив позиций корзины

    addItem: function (product) { // добавление товара в корзину
        let itemFound = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === product) { // если такой товар уже есть в корзине, то увеличиваем его кол-во
                this.items[i].amount++;
                itemFound = true;
                break;
            };
        };

        if (!itemFound) { // если такого товара в корзине ещё нет, то добавляем его
            this.items.push(product);
            this.items[this.items.length - 1].amount++;
        };
    },

    countSubtotals: function () { // заполнение подытогов по позициям корзины
        for (let i = 0; i < basket.items.length; i++) {
            basket.items[i].subtotal = basket.items[i].actionPrice() * basket.items[i].amount;
        };
    },

    countBasketPrice: function () { // итоговая стоимость корзины
        let total = 0;

        for (let i = 0; i < basket.items.length; i++) {
            total += basket.items[i].subtotal;
        }

        return total;
    },

    countBasketAmount: function () { // подсчёт кол-ва товаров в корзине
        let totalAmount = 0;
        for (let i = 0; i < basket.items.length; i++) {
            totalAmount += basket.items[i].amount;
        }
        return totalAmount;
    },

    getBasketMessage: function () { // формирование итоговой строки корзины
        if (basket.items.length > 0) {
            return `В корзине: ${basket.countBasketAmount()} товар(ов) на сумму <b>$${basket.countBasketPrice()} </b>`;
        } else {
            return 'Корзина пуста';
        };
    },

    clear: function () { // очистка корзины с запросом подтверждения
        if (confirm('Вы уверены, что хотите удалить всё из корзины?')) {
            this.items.forEach(item => { item.amount = 0 }); // сбрасываем кол-во каждого товара
            this.items = [];
        };
    }
};

function itemButtonHandler(basket, item) { // нажатие "Добавить в корзину"
    basket.addItem(item);
    renderBasket(basket);
};

function renderCatalog(catalog, basket) {
    const catalogContainer = document.querySelector('.catalog');
    for (let i = 0; i < catalog.length; i++) {

        const item = document.createElement('div');
        item.classList.add('item');

        const itemTitle = document.createElement('h2');
        itemTitle.innerText = catalog[i].name;
        item.appendChild(itemTitle);


        const itemImage = document.createElement('img');
        itemImage.src = catalog[i].image;
        itemImage.alt = catalog[i].name;
        itemImage.classList.add('main-image');
        itemImage.addEventListener('click', (event) => {
            let sliderEl = new CreateSlider(catalog[i]); // при клике на картинку создаём слайдер с данным товаром
        });
        item.appendChild(itemImage);

        const itemPrice = document.createElement('p');
        itemPrice.innerText = `Цена: $${catalog[i].price}`;
        item.appendChild(itemPrice);

        const itemButton = document.createElement('button');
        itemButton.innerText = 'Добавить в корзину';
        item.appendChild(itemButton);

        itemButton.addEventListener('click', (event) => {
            itemButtonHandler(basket, catalog[i]);
        });

        catalogContainer.appendChild(item);
    }
};

function renderBasket(basket) {
    let basketContainer = document.querySelector(".basket");
    basketContainer.innerHTML = '';

    basket.countSubtotals();

    for (let i = 0; i < basket.items.length; i++) { // формируем и выводим строки с товарами в корзине
        let basketLine = document.createElement("div");
        basketLine.className = "basket-line";
        basketLine.innerHTML = `Название: ${basket.items[i].name}; Кол-во: ${basket.items[i].amount}; Цена: $${basket.items[i].price}; Скидка: ${basket.items[i].discount}%;  Стоимость: <b>$${basket.items[i].subtotal}</b>`;
        basketContainer.appendChild(basketLine);
    };

    let basketTotalLine = document.createElement("div"); // формируем и выводим итоговую строку корзины
    basketTotalLine.className = "basket-total-line";
    basketTotalLine.innerHTML = basket.getBasketMessage();
    basketContainer.appendChild(basketTotalLine);

    let clearButton = document.createElement("button"); // кнопка очистки корзины
    clearButton.className = "clear-button hidden";
    if (basket.items.length > 0) {
        clearButton.classList.remove("hidden");
    }
    clearButton.innerText = "Очистить корзину";
    clearButton.addEventListener('click', (event) => {
        basket.clear();
        renderBasket(basket);
    });
    basketContainer.appendChild(clearButton);
};

let product1 = { name: 'Burton X', code: 'brtn-234-018', price: 500, image: 'images/burton.webp' };
let product2 = { name: 'Rossignol', code: 'rsgnl-14-2673', price: 300, image: 'images/rossignol.jpg' };
let product3 = { name: 'Capita', code: 'cpt-65-14', price: 400, image: 'images/capita.jpg' };

product1 = new CreateProduct(product1); // создаём экземпляры продуктов с прототипом от функции-конструктора
product2 = new CreateProduct(product2);
product3 = new CreateProduct(product3);

product1.secImages = ['images/burton1.jpg', 'images/burton2.jpg', 'images/burton3.jpg', 'images/burton4.jpg', 'images/burton5.jpg']; // доп. картинки
product2.secImages = ['images/rossignol1.jpg', 'images/rossignol2.jpg', 'images/rossignol3.jpg'];
product3.secImages = ['images/capita1.jpeg', 'images/capita2.jpg', 'images/capita3.jpg', 'images/capita4.jpg'];


product1.discount = 10; // для этого продукта прописали скидку 10%; для остальных она прописана в прототипе - 0%

const catalog = [product1, product2, product3];

renderCatalog(catalog, basket);

renderBasket(basket);

