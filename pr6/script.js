let products = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 8;

const productsContainer = document.getElementById('products-container');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const filterBtn = document.getElementById('filterBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

document.addEventListener('DOMContentLoaded', function() {
    let cachedData = localStorage.getItem('apiProducts');
    
    if (cachedData) {
        try {
            products = JSON.parse(cachedData);
            filteredProducts = [...products];
            updatePagination();
            displayProducts();
        } catch (err) {
            console.log('Помилка при парсингу даних з localStorage:', err);
            fetchProducts();
        }
    } else {
        fetchProducts();
    }
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    filterBtn.addEventListener('click', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });
});

// функція для отримання товарів з API
async function fetchProducts() {
    showLoader();
    
    try {
        let response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error('Не вдалося отримати дані з сервера. Спробуйте пізніше!');
        }
        
        products = await response.json();
        filteredProducts = [...products];
        
        localStorage.setItem('apiProducts', JSON.stringify(products));
        
        updatePagination();
        displayProducts();
    } catch (error) {
        showError(error.message);
        console.error('Помилка при отриманні даних:', error);
    } finally {
        hideLoader();
    }
}

// показуємо товари
function displayProducts() {
    productsContainer.innerHTML = '';
    
    let startIdx = (currentPage - 1) * itemsPerPage;
    let endIdx = startIdx + itemsPerPage;
    let currentProducts = filteredProducts.slice(startIdx, endIdx);
    
    if (currentProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-results">Товарів не знайдено :(</p>';
        return;
    }
    
    for (let i = 0; i < currentProducts.length; i++) {
        let product = currentProducts[i];
        
        let productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-price">${product.price.toFixed(2)} $</p>
            <p class="product-description">${product.description}</p>
        `;
        
        productsContainer.appendChild(productCard);
    }
}

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    let searchText = searchInput.value.toLowerCase().trim();
    let category = categoryFilter.value;
    let minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
    let maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : 999999; // великий максимум
    
    filteredProducts = products.filter(function(product) {
        let matchSearch = product.title.toLowerCase().includes(searchText) || 
                          product.description.toLowerCase().includes(searchText);
        let matchCategory = !category || product.category === category;
        let matchPrice = product.price >= minPrice && product.price <= maxPrice;
        
        return matchSearch && matchCategory && matchPrice;
    });
    
    currentPage = 1;
    updatePagination();
    displayProducts();
}

function updatePagination() {
    let totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

function showLoader() {
    loader.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideLoader() {
    loader.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
} 