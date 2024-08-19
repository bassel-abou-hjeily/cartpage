const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close');
const body = document.querySelector('body');
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-cart span');

const productData = [
    {
        "id": 1,
        "name": "Air Force",
        "color": ["black"],
        "size": [42, 43, 44],
        "price": 119,
        "image": "img/air.png"
    },
    {
        "id": 2,
        "name": "Air Jordan",
        "color": ["dark blue"],
        "size": [42, 43, 44],
        "price": 119,
        "image": "img/air2.png"
    },
    {
        "id": 3,
        "name": "Blazer",
        "color": ["lightgray"],
        "size": [42, 43, 44],
        "price": 109,
        "image": "img/blazer.png"
    },
    {
        "id": 4,
        "name": "Blazer",
        "color": ["lightgray"],
        "size": [42, 43, 44],
        "price": 109,
        "image": "img/blazer2.png"
    },
    {
        "id": 5,
        "name": "Crater",
        "color": ["black"],
        "size": [42, 43, 44],
        "price": 129,
        "image": "img/crater.png"
    },
    {
        "id": 6,
        "name": "Crater",
        "color": ["lightgray"],
        "size": [42, 43, 44],
        "price": 129,
        "image": "img/crater2.png"
    },
    {
        "id": 7,
        "name": "Hippie",
        "color": ["black", "gray"],
        "size": [42, 43, 44],
        "price": 99,
        "image": "img/hippie.png"
    },
    {
        "id": 8,
        "name": "Hippie",
        "color": ["black", "gray"],
        "size": [42, 43, 44],
        "price": 99,
        "image": "img/hippie2.png"
    },
    {
        "id": 9,
        "name": "Jordan",
        "color": ["green"],
        "price": 149,
        "image": "img/jordan.png"
    },
    {
        "id": 10,
        "name": "Jordan2",
        "color": ["green"],
        "size": [42, 43, 44],
        "price": 149,
        "image": "img/jordan.png"
    }
];

let allProducts = productData;
let carts = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.add('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Determine the type of products to display based on the page URL
const getProductType = () => {
    const page = window.location.pathname.split('/').pop();
    switch (page) {
        case 'air.html': return 'air';
        case 'jordan.html': return 'jordan';
        case 'hippie.html': return 'hippie';
        case 'crater.html': return 'crater';
        case 'blazer.html': return 'blazer';
        default: return '';
    }
};

// Render products to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = "";
    const productType = getProductType();
    const filteredProducts = allProducts.filter(product => product.name.toLowerCase().startsWith(productType));

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('items');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name} ${product.color ? product.color.join(', ') : ''}</h2>
                <div class="price">$${product.price.toFixed(2)}</div>
                <select class="size-select">
                    ${product.size.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
                <select class="color-select">
                    ${product.color.map(color => `<option value="${color}">${color}</option>`).join('')}
                </select>
                <button class="addcart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Add product to cart
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addcart')) {
        const productElement = event.target.parentElement;
        const productId = productElement.dataset.id;
        const size = productElement.querySelector('.size-select')?.value;
        const color = productElement.querySelector('.color-select')?.value;
        addToCart(productId, size, color);
    }
});

const addToCart = (productId, size, color) => {
    const productIndex = carts.findIndex(item => item.productId === productId && item.size === size && item.color === color);

    if (productIndex < 0) {
        carts.push({
            productId: productId,
            quantity: 1,
            size: size,
            color: color
        });
    } else {
        carts[productIndex].quantity += 1;
    }
    updateCartDisplay();
    saveCartToLocalStorage();
};

// Save cart to local storage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

// Render cart to HTML
const updateCartDisplay = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            const product = allProducts.find(p => p.id == cart.productId);

            const newCartItem = document.createElement('div');
            newCartItem.classList.add('items');
            newCartItem.dataset.id = cart.productId;
            newCartItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="name">${product.name} ${cart.color ? cart.color : ''}</div>
                <div class="totalPrice">$${(product.price * cart.quantity).toFixed(2)}</div>
                <div class="quantity" data-id="${cart.productId}">
                    <span class="minus">&lt;</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">&gt;</span>
                </div>
            `;
            listCartHTML.appendChild(newCartItem);
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

// Change quantity of items in cart
listCartHTML.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('minus') || target.classList.contains('plus')) {
        const productId = target.parentElement.dataset.id;
        const action = target.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(productId, action);
    }
});

const changeQuantity = (productId, action) => {
    const itemIndex = carts.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
        if (action === 'plus') {
            carts[itemIndex].quantity += 1;
        } else if (action === 'minus') {
            carts[itemIndex].quantity -= 1;
            if (carts[itemIndex].quantity <= 0) {
                carts.splice(itemIndex, 1);
            }
        }
        saveCartToLocalStorage();
        updateCartDisplay();
    }
};

// Initialize app
const initApp = () => {
    addDataToHTML();
    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        updateCartDisplay();
    }
};

initApp();


const clearCartButton = document.querySelector('.btn .clear');
clearCartButton.addEventListener('click', () => {
    // Clear 
    carts = [];

    // Update 
    updateCartDisplay();

    // Remove data
    localStorage.removeItem('cart');
    window.location.href = 'C:\Users\ahmad\OneDrive\Desktop\cart page\crater.html';

    body.classList.remove('showCart');
});

const returnhome = document.querySelector('.btn .return');
returnhome.addEventListener('click', () => {
    window.location.href = 'index.html';
    body.classList.remove('showCart');
});

