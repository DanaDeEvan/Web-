document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const sortSelect = document.getElementById('sortBy');
    const categoryFilters = document.getElementById('category-filters');
    const ratingFilters = document.getElementById('rating-filters');
    const priceMinRange = document.getElementById('price-min');
    const priceMaxRange = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    const resetBtn = document.getElementById('reset-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    const productsContainer = document.getElementById('products-container');
    const productCount = document.getElementById('product-count');
    
    let filterSystem = null;
    
    function fetchProducts() {
        productsContainer.innerHTML = '<div class="loading">Завантаження товарів...</div>';
        
        fetch('https://fakestoreapi.com/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Помилка завантаження даних');
                }
                return response.json();
            })
            .then(data => {
                filterSystem = new FilterSystem(data);
                setMinMaxPrices(data);
                displayProducts(data);
                attachEventListeners();
            })
            .catch(error => {
                console.error('Помилка:', error);
                productsContainer.innerHTML = `
                    <div class="error">
                        <p>Помилка завантаження товарів: ${error.message}</p>
                        <button id="retry-btn">Спробувати знову</button>
                    </div>
                `;
                document.getElementById('retry-btn').addEventListener('click', fetchProducts);
            });
    }
    
    function setMinMaxPrices(products) {
        let minPrice = Math.floor(Math.min(...products.map(product => product.price)));
        let maxPrice = Math.ceil(Math.max(...products.map(product => product.price)));
        
        priceMinRange.min = minPrice;
        priceMinRange.max = maxPrice;
        priceMinRange.value = minPrice;
        
        priceMaxRange.min = minPrice;
        priceMaxRange.max = maxPrice;
        priceMaxRange.value = maxPrice;
        
        priceMinValue.min = minPrice;
        priceMinValue.max = maxPrice;
        priceMinValue.value = minPrice;
        
        priceMaxValue.min = minPrice;
        priceMaxValue.max = maxPrice;
        priceMaxValue.value = maxPrice;
    }
    
    function displayProducts(products) {
        productCount.textContent = `(${products.length})`;
        productsContainer.innerHTML = '';
        
        if (products.length === 0) {
            productsContainer.innerHTML = '<div class="no-results">Товари не знайдено</div>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <div class="product-title">${product.title}</div>
                    <div class="product-details">
                        <div class="product-price">${product.price.toFixed(2)} ₴</div>
                        <div class="product-rating">
                            ★ <span>${product.rating.rate} (${product.rating.count})</span>
                        </div>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
    }
    
    function updateActiveFilters() {
        const activeFilters = filterSystem.getActiveFilters();
        activeFiltersContainer.innerHTML = '';
        
        if (activeFilters.length === 0) {
            return;
        }
        
        activeFilters.forEach(filter => {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.innerHTML = `
                ${filter.label}
                <button data-filter-id="${filter.id}" data-filter-type="${filter.type}">×</button>
            `;
            
            filterTag.querySelector('button').addEventListener('click', function() {
                removeFilter(this.dataset.filterType, this.dataset.filterId);
            });
            
            activeFiltersContainer.appendChild(filterTag);
        });
    }
    
    function removeFilter(type, id) {
        switch (type) {
            case 'search':
                searchInput.value = '';
                break;
            case 'category':
                document.querySelector(`#category-filters input[value="${id}"]`).checked = false;
                break;
            case 'rating':
                document.querySelector(`#rating-filters input[value="${id}"]`).checked = false;
                break;
            case 'price':
                priceMinRange.value = priceMinRange.min;
                priceMinValue.value = priceMinRange.min;
                priceMaxRange.value = priceMaxRange.max;
                priceMaxValue.value = priceMaxRange.max;
                break;
        }
        
        applyFilters();
    }
    
    function attachEventListeners() {
        searchBtn.addEventListener('click', applyFilters);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                applyFilters();
            }
        });
        
        sortSelect.addEventListener('change', applyFilters);
        
        const categoryCheckboxes = categoryFilters.querySelectorAll('input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        const ratingCheckboxes = ratingFilters.querySelectorAll('input[type="checkbox"]');
        ratingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        priceMinRange.addEventListener('input', function() {
            priceMinValue.value = this.value;
            if (parseInt(priceMinRange.value) > parseInt(priceMaxRange.value)) {
                priceMaxRange.value = priceMinRange.value;
                priceMaxValue.value = priceMinRange.value;
            }
            applyFilters();
        });
        
        priceMaxRange.addEventListener('input', function() {
            priceMaxValue.value = this.value;
            if (parseInt(priceMaxRange.value) < parseInt(priceMinRange.value)) {
                priceMinRange.value = priceMaxRange.value;
                priceMinValue.value = priceMaxRange.value;
            }
            applyFilters();
        });
        
        priceMinValue.addEventListener('change', function() {
            priceMinRange.value = this.value;
            if (parseInt(priceMinValue.value) > parseInt(priceMaxValue.value)) {
                priceMaxValue.value = priceMinValue.value;
                priceMaxRange.value = priceMinValue.value;
            }
            applyFilters();
        });
        
        priceMaxValue.addEventListener('change', function() {
            priceMaxRange.value = this.value;
            if (parseInt(priceMaxValue.value) < parseInt(priceMinValue.value)) {
                priceMinValue.value = priceMaxValue.value;
                priceMinRange.value = priceMaxValue.value;
            }
            applyFilters();
        });
        
        resetBtn.addEventListener('click', resetFilters);
    }
    
    function applyFilters() {
        if (!filterSystem) return;
        
        const searchText = searchInput.value.trim().toLowerCase();
        const sortCriterion = sortSelect.value;
        
        const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedRatings = Array.from(document.querySelectorAll('#rating-filters input:checked'))
            .map(checkbox => parseInt(checkbox.value));
        
        const minPrice = parseInt(priceMinRange.value);
        const maxPrice = parseInt(priceMaxRange.value);
        
        const filteredProducts = filterSystem.applyFilters(
            searchText,
            selectedCategories,
            selectedRatings,
            minPrice,
            maxPrice,
            sortCriterion
        );
        
        displayProducts(filteredProducts);
        updateActiveFilters();
        saveFilterState();
    }
    
    function resetFilters() {
        searchInput.value = '';
        sortSelect.value = 'default';
        
        const categoryCheckboxes = document.querySelectorAll('#category-filters input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        const ratingCheckboxes = document.querySelectorAll('#rating-filters input[type="checkbox"]');
        ratingCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        priceMinRange.value = priceMinRange.min;
        priceMinValue.value = priceMinRange.min;
        priceMaxRange.value = priceMaxRange.max;
        priceMaxValue.value = priceMaxRange.max;
        
        applyFilters();
        localStorage.removeItem('filterState');
    }
    
    function saveFilterState() {
        const filterState = {
            search: searchInput.value,
            sort: sortSelect.value,
            categories: Array.from(document.querySelectorAll('#category-filters input:checked'))
                .map(checkbox => checkbox.value),
            ratings: Array.from(document.querySelectorAll('#rating-filters input:checked'))
                .map(checkbox => parseInt(checkbox.value)),
            priceMin: parseInt(priceMinRange.value),
            priceMax: parseInt(priceMaxRange.value)
        };
        
        localStorage.setItem('filterState', JSON.stringify(filterState));
    }
    
    function loadFilterState() {
        const savedState = localStorage.getItem('filterState');
        
        if (!savedState) return;
        
        try {
            const filterState = JSON.parse(savedState);
            
            if (filterState.search) {
                searchInput.value = filterState.search;
            }
            
            if (filterState.sort) {
                sortSelect.value = filterState.sort;
            }
            
            if (filterState.categories && filterState.categories.length > 0) {
                filterState.categories.forEach(category => {
                    const checkbox = document.querySelector(`#category-filters input[value="${category}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            if (filterState.ratings && filterState.ratings.length > 0) {
                filterState.ratings.forEach(rating => {
                    const checkbox = document.querySelector(`#rating-filters input[value="${rating}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            if (filterState.priceMin !== undefined) {
                priceMinRange.value = filterState.priceMin;
                priceMinValue.value = filterState.priceMin;
            }
            
            if (filterState.priceMax !== undefined) {
                priceMaxRange.value = filterState.priceMax;
                priceMaxValue.value = filterState.priceMax;
            }
            
            if (filterSystem) {
                applyFilters();
            }
        } catch (error) {
            console.error('Помилка завантаження стану фільтрів:', error);
            localStorage.removeItem('filterState');
        }
    }
    
    class FilterSystem {
        constructor(data) {
            this.data = data;
            this.filteredData = [...data];
        }
        
        applyFilters(searchText, categories, ratings, minPrice, maxPrice, sortCriterion) {
            let result = [...this.data];
            
            if (searchText) {
                result = result.filter(product => 
                    product.title.toLowerCase().includes(searchText) ||
                    product.description.toLowerCase().includes(searchText)
                );
            }
            
            if (categories.length > 0) {
                result = result.filter(product => 
                    categories.includes(product.category)
                );
            }
            
            if (ratings.length > 0) {
                result = result.filter(product => {
                    return ratings.some(rating => product.rating.rate >= rating);
                });
            }
            
            result = result.filter(product => 
                product.price >= minPrice && product.price <= maxPrice
            );
            
            this.sortData(result, sortCriterion);
            
            this.filteredData = result;
            
            return result;
        }
        
        sortData(data, criterion) {
            switch (criterion) {
                case 'priceAsc':
                    data.sort((a, b) => a.price - b.price);
                    break;
                case 'priceDesc':
                    data.sort((a, b) => b.price - a.price);
                    break;
                case 'nameAsc':
                    data.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'nameDesc':
                    data.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'ratingDesc':
                    data.sort((a, b) => b.rating.rate - a.rating.rate);
                    break;
                default:
                    data.sort((a, b) => a.id - b.id);
            }
        }
        
        getActiveFilters() {
            const activeFilters = [];
            
            const searchText = document.getElementById('search').value.trim();
            if (searchText) {
                activeFilters.push({
                    id: 'search',
                    type: 'search',
                    label: `Пошук: "${searchText}"`
                });
            }
            
            const selectedCategories = document.querySelectorAll('#category-filters input:checked');
            selectedCategories.forEach(checkbox => {
                activeFilters.push({
                    id: checkbox.value,
                    type: 'category',
                    label: `Категорія: ${checkbox.parentElement.textContent.trim()}`
                });
            });
            
            const selectedRatings = document.querySelectorAll('#rating-filters input:checked');
            selectedRatings.forEach(checkbox => {
                activeFilters.push({
                    id: checkbox.value,
                    type: 'rating',
                    label: `Рейтинг: ${checkbox.parentElement.textContent.trim()}`
                });
            });
            
            const minPrice = parseInt(document.getElementById('price-min').value);
            const maxPrice = parseInt(document.getElementById('price-max').value);
            const minPriceDefault = parseInt(document.getElementById('price-min').min);
            const maxPriceDefault = parseInt(document.getElementById('price-max').max);
            
            if (minPrice > minPriceDefault || maxPrice < maxPriceDefault) {
                activeFilters.push({
                    id: 'price',
                    type: 'price',
                    label: `Ціна: ${minPrice} - ${maxPrice} ₴`
                });
            }
            
            return activeFilters;
        }
    }
    
    fetchProducts();
    
    loadFilterState();
}); 