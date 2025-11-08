// Dados dos produtos
const products = [
  {
    id: 1,
    name: "Pacote Internet 5GB",
    category: "Internet",
    price: 350,
    image: "assets/images/product1.jpg",
  },
  {
    id: 2,
    name: "Pacote Internet 10GB",
    category: "Internet",
    price: 550,
    image: "assets/images/product2.jpg",
  },
  {
    id: 3,
    name: "Pacote Voz 100min",
    category: "Voz",
    price: 200,
    image: "assets/images/product3.jpg",
  },
  {
    id: 4,
    name: "Pacote Voz 300min",
    category: "Voz",
    price: 50,
    image: "assets/images/product4.jpg",
  },
  {
    id: 5,
    name: "Smartphone Samsung A15",
    category: "Dispositivos",
    price: 8500,
    image: "assets/images/product5.jpg",
  },
  {
    id: 6,
    name: "Smartphone Tecno Spark",
    category: "Dispositivos",
    price: 6500,
    image: "assets/images/product6.jpg",
  },
  {
    id: 7,
    name: "Modem 4G",
    category: "Dispositivos",
    price: 2500,
    image: "assets/images/product7.jpg",
  },
  {
    id: 8,
    name: "Recarga e-Mola 200MT",
    category: "e-Mola",
    price: 500,
    image: "assets/images/product8.jpg",
  },
];

// Carrinho
let cart = JSON.parse(localStorage.getItem("movitelCart")) || [];

// Elementos DOM
const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const sortBy = document.getElementById("sort-by");
const sortOrder = document.getElementById("sort-order");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector("nav");

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  renderProducts(products);
  renderCart();
  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Menu móvel
  mobileMenuBtn.addEventListener("click", function () {
    nav.classList.toggle("active");
  });

  // Pesquisa
  searchInput.addEventListener("input", function () {
    filterAndSortProducts();
  });

  // Ordenação
  sortBy.addEventListener("change", function () {
    filterAndSortProducts();
  });

  sortOrder.addEventListener("change", function () {
    filterAndSortProducts();
  });
}

// Renderizar produtos
function renderProducts(productsToRender) {
  productsGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    productsGrid.innerHTML =
      '<p class="empty-cart-message">Nenhum produto encontrado.</p>';
    return;
  }

  productsToRender.forEach((product) => {
    const isInCart = cart.some((item) => item.id === product.id);

    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>Categoria: ${product.category}</p>
                <p class="price">${product.price} MT</p>
                <div class="product-actions">
                    ${
                      isInCart
                        ? `<button class="remove-item" data-id="${product.id}">Remover</button>`
                        : `<button class="add-to-cart" data-id="${product.id}">Adicionar</button>`
                    }
                </div>
            </div>
        `;

    productsGrid.appendChild(productCard);
  });

  // Adicionar event listeners aos botões
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId);
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      removeFromCart(productId);
    });
  });
}

// Filtrar e ordenar produtos
function filterAndSortProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortField = sortBy.value;
  const order = sortOrder.value;

  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );

  // Ordenar produtos
  filteredProducts.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Para ordenação por nome ou categoria
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  renderProducts(filteredProducts);
}

// Adicionar a minhas compras
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  if (product && !cart.some((item) => item.id === productId)) {
    cart.push({ ...product, quantity: 1 });
    saveCart();
    renderProducts(products);
    renderCart();
  }
}

// Remover das minhas compras
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderProducts(products);
  renderCart();
}

// Renderizar minhas compras
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart-message">A sua pasta compras está vazia.</p>';
    cartTotal.textContent = "Total: 0 MT";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Categoria: ${item.category}</p>
                </div>
            </div>
            <div class="cart-item-price">${item.price} MT</div>
        `;

    cartItems.appendChild(cartItem);
    total += item.price;
  });

  cartTotal.textContent = `Total: ${total} MT`;
}

// Salvar minhas compras no localStorage
function saveCart() {
  localStorage.setItem("movitelCart", JSON.stringify(cart));
}
