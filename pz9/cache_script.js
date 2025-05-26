document.addEventListener('DOMContentLoaded', function() {
    
    // Ініціалізація класів для роботи з кешуванням
    class LocalStorageManager {
        constructor() {
            this.prefix = 'praktichna9_';
        }
        
        set(key, value, expiry = null) {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + (expiry * 60 * 1000) : null
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
        }
        
        get(key) {
            const itemStr = localStorage.getItem(this.prefix + key);
            if (!itemStr) return null;
            
            try {
                const item = JSON.parse(itemStr);
                if (item.expiry && Date.now() > item.expiry) {
                    this.remove(key);
                    return null;
                }
                return item.value;
            } catch (e) {
                this.remove(key);
                return null;
            }
        }
        
        remove(key) {
            localStorage.removeItem(this.prefix + key);
        }
        
        clear() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        getSize() {
            let size = 0;
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    size += localStorage.getItem(key).length;
                }
            });
            return (size / 1024).toFixed(2);
        }
    }
    
    class ImageCache {
        constructor() {
            this.cache = new Map();
            this.storageKey = 'cached_images';
        }
        
        async loadImage(url) {
            // Перевірка кешу в пам'яті
            if (this.cache.has(url)) {
                return this.cache.get(url);
            }
            
            // Перевірка кешу в sessionStorage
            const cachedData = sessionStorage.getItem(this.storageKey + '_' + btoa(url));
            if (cachedData) {
                const data = JSON.parse(cachedData);
                if (Date.now() - data.timestamp < 5 * 60 * 1000) { // 5 хвилин
                    this.cache.set(url, data.dataUrl);
                    return data.dataUrl;
                }
            }
            
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const dataUrl = await this.blobToDataURL(blob);
                
                // Збереження в пам'ять
                this.cache.set(url, dataUrl);
                
                // Збереження в sessionStorage
                const cacheData = {
                    dataUrl: dataUrl,
                    timestamp: Date.now()
                };
                sessionStorage.setItem(this.storageKey + '_' + btoa(url), JSON.stringify(cacheData));
                
                return dataUrl;
            } catch (error) {
                console.error('Помилка завантаження зображення:', error);
                return null;
            }
        }
        
        blobToDataURL(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }
        
        clearCache() {
            this.cache.clear();
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(this.storageKey)) {
                    sessionStorage.removeItem(key);
                }
            });
        }
        
        getCacheSize() {
            return this.cache.size;
        }
    }
    
    class DataCache {
        constructor() {
            this.cache = new Map();
            this.expiryTime = 5 * 60 * 1000; // 5 хвилин
        }
        
        async getData(url, forceRefresh = false) {
            const cacheKey = url;
            
            if (!forceRefresh && this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.expiryTime) {
                    return cached.data;
                }
            }
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                return data;
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
                throw error;
            }
        }
        
        getCacheSize() {
            return this.cache.size;
        }
        
        clearCache() {
            this.cache.clear();
        }
    }
    
    // Ініціалізація менеджерів
    const storage = new LocalStorageManager();
    const imageCache = new ImageCache();
    const dataCache = new DataCache();
    
    // Елементи DOM
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const preferencesSelect = document.getElementById('preferences');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    const loadImagesBtn = document.getElementById('loadImages');
    const clearCacheBtn = document.getElementById('clearCache');
    const imageContainer = document.getElementById('imageContainer');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error_message');
    const dataContainer = document.getElementById('data_container');
    
    const autoSaveCheckbox = document.getElementById('autoSave');
    const cacheExpiryInput = document.getElementById('cacheExpiry');
    const compressionLevelSelect = document.getElementById('compressionLevel');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    const updateStatsBtn = document.getElementById('updateStats');
    
    // Завантаження збережених даних при старті
    function loadSavedData() {
        const savedUsername = storage.get('username');
        const savedEmail = storage.get('email');
        const savedPreferences = storage.get('preferences');
        const savedSettings = storage.get('settings');
        
        if (savedUsername) usernameInput.value = savedUsername;
        if (savedEmail) emailInput.value = savedEmail;
        if (savedPreferences) preferencesSelect.value = savedPreferences;
        
        if (savedSettings) {
            autoSaveCheckbox.checked = savedSettings.autoSave || false;
            cacheExpiryInput.value = savedSettings.cacheExpiry || 5;
            compressionLevelSelect.value = savedSettings.compressionLevel || 'medium';
        }
        
        // Застосування теми
        if (savedPreferences) {
            applyTheme(savedPreferences);
        }
        
        updateStatistics();
    }
    
    // Застосування теми
    function applyTheme(theme) {
        const body = document.body;
        body.classList.remove('dark-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                body.classList.add('dark-theme');
            }
        }
    }
    
    // Обробка форми
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const preferences = preferencesSelect.value;
        
        if (username) {
            const expiry = parseInt(cacheExpiryInput.value) || 5;
            storage.set('username', username, expiry);
            storage.set('email', email, expiry);
            storage.set('preferences', preferences, expiry);
            
            applyTheme(preferences);
            updateStatistics();
            
            pokazatyPovidomlennya('Дані успішно збережено!', 'success');
        }
    });
    
    clearBtn.addEventListener('click', function() {
        storage.clear();
        userForm.reset();
        document.body.classList.remove('dark-theme');
        updateStatistics();
        pokazatyPovidomlennya('Дані очищено!', 'info');
    });
    
    // Автозбереження
    function setupAutoSave() {
        const inputs = [usernameInput, emailInput, preferencesSelect];
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (autoSaveCheckbox.checked) {
                    const expiry = parseInt(cacheExpiryInput.value) || 5;
                    storage.set(input.name, input.value, expiry);
                    updateStatistics();
                }
            });
        });
    }
    
    // Завантаження зображень
    loadImagesBtn.addEventListener('click', async function() {
        const imageCards = imageContainer.querySelectorAll('.kartka_zobrazhennya');
        
        for (const card of imageCards) {
            const url = card.dataset.url;
            const placeholder = card.querySelector('.placeholder');
            
            if (placeholder) {
                placeholder.textContent = 'Завантаження...';
                
                try {
                    const dataUrl = await imageCache.loadImage(url);
                    if (dataUrl) {
                        const img = document.createElement('img');
                        img.src = dataUrl;
                        img.alt = card.querySelector('h3').textContent;
                        card.replaceChild(img, placeholder);
                    }
                } catch (error) {
                    placeholder.textContent = 'Помилка завантаження';
                    placeholder.style.color = '#e74c3c';
                }
            }
        }
        
        updateStatistics();
        pokazatyPovidomlennya('Зображення завантажено!', 'success');
    });
    
    clearCacheBtn.addEventListener('click', function() {
        imageCache.clearCache();
        
        // Відновлення плейсхолдерів
        const imageCards = imageContainer.querySelectorAll('.kartka_zobrazhennya');
        imageCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.textContent = 'Завантаження...';
                card.replaceChild(placeholder, img);
            }
        });
        
        updateStatistics();
        pokazatyPovidomlennya('Кеш зображень очищено!', 'info');
    });
    
    // Пошук користувачів
    searchBtn.addEventListener('click', async function() {
        const query = searchInput.value.trim().toLowerCase();
        await loadUsers(query);
    });
    
    refreshBtn.addEventListener('click', async function() {
        await loadUsers('', true);
    });
    
    async function loadUsers(query = '', forceRefresh = false) {
        pokazatyLoader(true);
        skrytyPomylku();
        
        try {
            const url = 'https://jsonplaceholder.typicode.com/users';
            const users = await dataCache.getData(url, forceRefresh);
            
            let filteredUsers = users;
            if (query) {
                filteredUsers = users.filter(user => 
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.username.toLowerCase().includes(query)
                );
            }
            
            displayUsers(filteredUsers);
            updateStatistics();
            
        } catch (error) {
            pokazatyPomylku('Помилка завантаження користувачів');
        } finally {
            pokazatyLoader(false);
        }
    }
    
    function displayUsers(users) {
        dataContainer.innerHTML = '';
        
        if (users.length === 0) {
            dataContainer.innerHTML = '<p>Користувачів не знайдено</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'kartka_korystuvacha';
            userCard.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Телефон:</strong> ${user.phone}</p>
                <p><strong>Компанія:</strong> ${user.company.name}</p>
            `;
            dataContainer.appendChild(userCard);
        });
    }
    
    function pokazatyLoader(show) {
        loader.classList.toggle('hidden', !show);
    }
    
    function pokazatyPomylku(text) {
        errorMessage.querySelector('p').textContent = text;
        errorMessage.classList.remove('hidden');
    }
    
    function skrytyPomylku() {
        errorMessage.classList.add('hidden');
    }
    
    // Збереження налаштувань
    saveSettingsBtn.addEventListener('click', function() {
        const settings = {
            autoSave: autoSaveCheckbox.checked,
            cacheExpiry: parseInt(cacheExpiryInput.value) || 5,
            compressionLevel: compressionLevelSelect.value
        };
        
        storage.set('settings', settings);
        updateStatistics();
        pokazatyPovidomlennya('Налаштування збережено!', 'success');
    });
    
    // Оновлення статистики
    updateStatsBtn.addEventListener('click', updateStatistics);
    
    function updateStatistics() {
        document.getElementById('localStorageSize').textContent = storage.getSize() + ' KB';
        document.getElementById('cachedImages').textContent = imageCache.getCacheSize();
        document.getElementById('cachedRequests').textContent = dataCache.getCacheSize();
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('uk-UA');
    }
    
    // Повідомлення
    function pokazatyPovidomlennya(text, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
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
    
    // Додавання анімацій
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
    
    // Ініціалізація
    loadSavedData();
    setupAutoSave();
    loadUsers(); // Завантаження початкових даних
});
