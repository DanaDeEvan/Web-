document.addEventListener('DOMContentLoaded', function() {
    
    // Дані товарів
    const originalData = [
        {
            id: 1,
            name: "iPhone 14 Pro",
            category: "electronics",
            price: 28999,
            rating: 4.8,
            inStock: true,
            icon: "📱"
        },
        {
            id: 2,
            name: "Samsung Galaxy S23",
            category: "electronics", 
            price: 25999,
            rating: 4.6,
            inStock: true,
            icon: "📱"
        },
        {
            id: 3,
            name: "Куртка зимова",
            category: "clothing",
            price: 2500,
            rating: 4.2,
            inStock: false,
            icon: "🧥"
        },
        {
            id: 4,
            name: "Джинси класичні",
            category: "clothing",
            price: 1200,
            rating: 4.0,
            inStock: true,
            icon: "👖"
        },
        {
            id: 5,
            name: "Програмування на JavaScript",
            category: "books",
            price: 450,
            rating: 4.9,
            inStock: true,
            icon: "📚"
        },
        {
            id: 6,
            name: "Вивчаємо React",
            category: "books",
            price: 380,
            rating: 4.7,
            inStock: true,
            icon: "📖"
        },
        {
            id: 7,
            name: "Кавоварка автоматична",
            category: "home",
            price: 8500,
            rating: 4.4,
            inStock: true,
            icon: "☕"
        },
        {
            id: 8,
            name: "Пилосос робот",
            category: "home",
            price: 6200,
            rating: 4.1,
            inStock: false,
            icon: "🤖"
        },
        {
            id: 9,
            name: "MacBook Air M2",
            category: "electronics",
            price: 35999,
            rating: 4.9,
            inStock: true,
            icon: "💻"
        },
        {
            id: 10,
            name: "Сукня літня",
            category: "clothing",
            price: 850,
            rating: 3.8,
            inStock: true,
            icon: "👗"
        },
        {
            id: 11,
            name: "Рослини для дому",
            category: "home",
            price: 320,
            rating: 4.3,
            inStock: true,
            icon: "🌱"
        },
        {
            id: 12,
            name: "Історія України",
            category: "books",
            price: 280,
            rating: 4.5,
            inStock: false,
            icon: "📜"
        }
    ];
    
    // Клас для управління фільтрацією та сортуванням
    class FilterSystem {
        constructor(data) {
            this.originalData = [...data];
            this.filteredData = [...data];
            this.currentFilters = {
                search: '',
                category: '',
                minPrice: '',
                maxPrice: '',
                rating: '',
                inStockOnly: false
            };
            this.currentSort = 'name_asc';
            
            this.initializeElements();
            this.bindEvents();
            this.renderItems();
            this.updateUI();
        }
        
        initializeElements() {
            this.searchInput = document.getElementById('searchInput');
            this.categoryFilter = document.getElementById('categoryFilter');
            this.minPriceInput = document.getElementById('minPrice');
            this.maxPriceInput = document.getElementById('maxPrice');
            this.ratingFilter = document.getElementById('ratingFilter');
            this.inStockCheckbox = document.getElementById('inStockOnly');
            this.sortSelect = document.getElementById('sortSelect');
            this.applyBtn = document.getElementById('applyFilters');
            this.resetBtn = document.getElementById('resetFilters');
            this.productsGrid = document.getElementById('productsGrid');
            this.resultsCount = document.getElementById('resultsCount');
            this.filterTags = document.getElementById('filterTags');
            this.noResults = document.getElementById('noResults');
        }
        
        bindEvents() {
            // Автоматичне застосування фільтрів при введенні
            this.searchInput.addEventListener('input', () => this.applyFilters());
            this.categoryFilter.addEventListener('change', () => this.applyFilters());
            this.minPriceInput.addEventListener('input', () => this.debounce(() => this.applyFilters(), 500)());
            this.maxPriceInput.addEventListener('input', () => this.debounce(() => this.applyFilters(), 500)());
            this.ratingFilter.addEventListener('change', () => this.applyFilters());
            this.inStockCheckbox.addEventListener('change', () => this.applyFilters());
            this.sortSelect.addEventListener('change', () => this.applyFilters());
            
            // Кнопки
            this.applyBtn.addEventListener('click', () => this.applyFilters());
            this.resetBtn.addEventListener('click', () => this.resetFilters());
        }
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        applyFilters() {
            // Оновлення поточних фільтрів
            this.currentFilters = {
                search: this.searchInput.value.toLowerCase().trim(),
                category: this.categoryFilter.value,
                minPrice: this.minPriceInput.value ? parseFloat(this.minPriceInput.value) : '',
                maxPrice: this.maxPriceInput.value ? parseFloat(this.maxPriceInput.value) : '',
                rating: this.ratingFilter.value ? parseFloat(this.ratingFilter.value) : '',
                inStockOnly: this.inStockCheckbox.checked
            };
            this.currentSort = this.sortSelect.value;
            
            // Застосування фільтрів
            this.filteredData = this.originalData.filter(item => {
                // Пошук за назвою
                if (this.currentFilters.search && 
                    !item.name.toLowerCase().includes(this.currentFilters.search)) {
                    return false;
                }
                
                // Фільтр категорії
                if (this.currentFilters.category && 
                    item.category !== this.currentFilters.category) {
                    return false;
                }
                
                // Фільтр мінімальної ціни
                if (this.currentFilters.minPrice !== '' && 
                    item.price < this.currentFilters.minPrice) {
                    return false;
                }
                
                // Фільтр максимальної ціни
                if (this.currentFilters.maxPrice !== '' && 
                    item.price > this.currentFilters.maxPrice) {
                    return false;
                }
                
                // Фільтр рейтингу
                if (this.currentFilters.rating !== '' && 
                    item.rating < this.currentFilters.rating) {
                    return false;
                }
                
                // Фільтр наявності
                if (this.currentFilters.inStockOnly && !item.inStock) {
                    return false;
                }
                
                return true;
            });
            
            // Сортування
            this.sortData();
            
            // Оновлення інтерфейсу
            this.renderItems();
            this.updateUI();
        }
        
        sortData() {
            const [field, direction] = this.currentSort.split('_');
            
            this.filteredData.sort((a, b) => {
                let valueA, valueB;
                
                switch(field) {
                    case 'name':
                        valueA = a.name.toLowerCase();
                        valueB = b.name.toLowerCase();
                        break;
                    case 'price':
                        valueA = a.price;
                        valueB = b.price;
                        break;
                    case 'rating':
                        valueA = a.rating;
                        valueB = b.rating;
                        break;
                    default:
                        return 0;
                }
                
                if (direction === 'asc') {
                    if (valueA < valueB) return -1;
                    if (valueA > valueB) return 1;
                    return 0;
                } else {
                    if (valueA > valueB) return -1;
                    if (valueA < valueB) return 1;
                    return 0;
                }
            });
        }
        
        renderItems() {
            this.productsGrid.innerHTML = '';
            
            if (this.filteredData.length === 0) {
                this.noResults.classList.remove('hidden');
                this.productsGrid.style.display = 'none';
                return;
            }
            
            this.noResults.classList.add('hidden');
            this.productsGrid.style.display = 'grid';
            
            this.filteredData.forEach(item => {
                const itemElement = this.createItemElement(item);
                this.productsGrid.appendChild(itemElement);
            });
        }
        
        createItemElement(item) {
            const div = document.createElement('div');
            div.className = 'kartka_tovaru';
            
            const stars = this.generateStars(item.rating);
            const categoryName = this.getCategoryName(item.category);
            const statusClass = item.inStock ? 'in-stock' : 'out-of-stock';
            const statusText = item.inStock ? 'В наявності' : 'Немає в наявності';
            
            div.innerHTML = `
                <div class="zobrazhennya_tovaru">
                    ${item.icon}
                </div>
                <div class="informaciya_tovaru">
                    <h3 class="nazva_tovaru">${item.name}</h3>
                    <p class="kategoriya_tovaru">${categoryName}</p>
                    <p class="cina_tovaru">${this.formatPrice(item.price)}</p>
                    <div class="reytyng_tovaru">
                        <span class="zirky">${stars}</span>
                        <span class="znachennya_reytyngu">${item.rating}</span>
                    </div>
                    <span class="status_tovaru ${statusClass}">${statusText}</span>
                </div>
            `;
            
            return div;
        }
        
        generateStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            let stars = '';
            
            for (let i = 0; i < fullStars; i++) {
                stars += '★';
            }
            
            if (hasHalfStar) {
                stars += '☆';
            }
            
            while (stars.length < 5) {
                stars += '☆';
            }
            
            return stars;
        }
        
        getCategoryName(category) {
            const categories = {
                'electronics': 'Електроніка',
                'clothing': 'Одяг',
                'books': 'Книги',
                'home': 'Дім і сад'
            };
            return categories[category] || category;
        }
        
        formatPrice(price) {
            return `${price.toLocaleString('uk-UA')} ₴`;
        }
        
        updateUI() {
            // Оновлення кількості результатів
            this.resultsCount.textContent = `Знайдено: ${this.filteredData.length} товарів`;
            
            // Оновлення активних фільтрів
            this.updateActiveFilters();
        }
        
        updateActiveFilters() {
            this.filterTags.innerHTML = '';
            
            const filters = [];
            
            if (this.currentFilters.search) {
                filters.push({
                    text: `Пошук: "${this.currentFilters.search}"`,
                    key: 'search'
                });
            }
            
            if (this.currentFilters.category) {
                filters.push({
                    text: `Категорія: ${this.getCategoryName(this.currentFilters.category)}`,
                    key: 'category'
                });
            }
            
            if (this.currentFilters.minPrice !== '') {
                filters.push({
                    text: `Від: ${this.formatPrice(this.currentFilters.minPrice)}`,
                    key: 'minPrice'
                });
            }
            
            if (this.currentFilters.maxPrice !== '') {
                filters.push({
                    text: `До: ${this.formatPrice(this.currentFilters.maxPrice)}`,
                    key: 'maxPrice'
                });
            }
            
            if (this.currentFilters.rating !== '') {
                filters.push({
                    text: `Рейтинг: ${this.currentFilters.rating}+ зірок`,
                    key: 'rating'
                });
            }
            
            if (this.currentFilters.inStockOnly) {
                filters.push({
                    text: 'Тільки в наявності',
                    key: 'inStockOnly'
                });
            }
            
            filters.forEach(filter => {
                const tag = document.createElement('span');
                tag.className = 'filter_tag';
                tag.innerHTML = `
                    ${filter.text}
                    <span class="remove_tag" data-filter="${filter.key}">×</span>
                `;
                
                // Додавання обробника для видалення фільтра
                tag.querySelector('.remove_tag').addEventListener('click', () => {
                    this.removeFilter(filter.key);
                });
                
                this.filterTags.appendChild(tag);
            });
        }
        
        removeFilter(filterKey) {
            switch(filterKey) {
                case 'search':
                    this.searchInput.value = '';
                    break;
                case 'category':
                    this.categoryFilter.value = '';
                    break;
                case 'minPrice':
                    this.minPriceInput.value = '';
                    break;
                case 'maxPrice':
                    this.maxPriceInput.value = '';
                    break;
                case 'rating':
                    this.ratingFilter.value = '';
                    break;
                case 'inStockOnly':
                    this.inStockCheckbox.checked = false;
                    break;
            }
            
            this.applyFilters();
        }
        
        resetFilters() {
            // Скидання всіх фільтрів
            this.searchInput.value = '';
            this.categoryFilter.value = '';
            this.minPriceInput.value = '';
            this.maxPriceInput.value = '';
            this.ratingFilter.value = '';
            this.inStockCheckbox.checked = false;
            this.sortSelect.value = 'name_asc';
            
            // Застосування змін
            this.applyFilters();
            
            // Показати повідомлення
            this.showNotification('Всі фільтри скинуто', 'success');
        }
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            switch (type) {
                case 'success':
                    notification.style.backgroundColor = '#27ae60';
                    break;
                case 'error':
                    notification.style.backgroundColor = '#e74c3c';
                    break;
                default:
                    notification.style.backgroundColor = '#3498db';
            }
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }
    
    // Додавання стилів для анімацій
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Ініціалізація системи фільтрації
    const filterSystem = new FilterSystem(originalData);
});
