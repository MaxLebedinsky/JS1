'use strict';
function CreateSlider(product) {
    this.itemLinks = []; // массив ссылок на картинки для слайдера
    this.itemLinks[0] = product.image; // первая картинка - основное фото товара
    product.secImages.forEach(item => { this.itemLinks.push(item) }); // остальные картинки - дополнительные

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    const body = document.querySelector('body');
    body.appendChild(overlay);

    overlay.addEventListener('click', (event) => { // при клике на overlay скрываем его и слайдер
        overlay.classList.add('hidden');
        slider.classList.add('hidden');
    })

    let slider = document.createElement('div');
    slider.classList.add('slider');
    body.appendChild(slider);

    const itemPics = []; // массив с картинками (img)
    this.itemLinks.forEach(item => {
        let pic = document.createElement('img');
        pic.classList.add('slider-img', 'hidden');
        pic.src = item;
        pic.alt = item;
        itemPics.push(pic);
        slider.appendChild(pic);
    })

    let leftArrow = document.createElement('i');
    leftArrow.classList.add('fas', 'fa-chevron-left', 'left-arrow');
    slider.insertAdjacentElement('beforeend', leftArrow);

    let rightArrow = document.createElement('i');
    rightArrow.classList.add('fas', 'fa-chevron-right', 'right-arrow');
    slider.insertAdjacentElement('beforeend', rightArrow);

    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        switch (event.key) {
            case "ArrowLeft":
                setNextLeftImage();
                break;
            case "ArrowRight":
                setNextRightImage();
                break;
            case "Escape":
                overlay.classList.add('hidden');
                slider.classList.add('hidden');
                break;
        };
    });

    leftArrow.addEventListener('click', function () {
        setNextLeftImage();
    });

    rightArrow.addEventListener('click', function () {
        setNextRightImage();
    });

    let currentId = 0;
    showCurrentImage(currentId); // изначально показываем основную картинку товара

    function setNextLeftImage() {
        hideCurrentImage(currentId);
        if (currentId === 0) {
            currentId = itemPics.length - 1;
        } else {
            currentId--;
        };
        showCurrentImage(currentId);
    };

    function setNextRightImage() {
        hideCurrentImage(currentId);
        if (currentId === itemPics.length - 1) {
            currentId = 0;
        } else {
            currentId++;
        };
        showCurrentImage(currentId);
    };

    function showCurrentImage(i) {
        itemPics[i].classList.remove('hidden');
    };

    function hideCurrentImage(i) {
        itemPics[i].classList.add('hidden');
    };

};
