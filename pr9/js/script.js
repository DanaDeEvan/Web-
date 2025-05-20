document.addEventListener('DOMContentLoaded', function() {
    sessionStorage.setItem('sessionStartTime', Date.now());
    
    // ========== Робота з формою та localStorage ==========
    const userForm = document.getElementById('userForm');
    const clearDataBtn = document.getElementById('clearData');
    const storageStatus = document.getElementById('storageStatus');
    
    function loadUserData() {
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const userAge = localStorage.getItem('userAge');
        
        if (userName) document.getElementById('userName').value = userName;
        if (userEmail) document.getElementById('userEmail').value = userEmail;
        if (userAge) document.getElementById('userAge').value = userAge;
        
        if (userName || userEmail || userAge) {
            storageStatus.textContent = 'Дані завантажено з localStorage';
            storageStatus.className = 'status';
        } else {
            storageStatus.textContent = 'Немає збережених даних';
            storageStatus.className = 'status';
        }
    }
    
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userAge = document.getElementById('userAge').value;
        
        if (userName) localStorage.setItem('userName', userName);
        if (userEmail) localStorage.setItem('userEmail', userEmail);
        if (userAge) localStorage.setItem('userAge', userAge);
        
        storageStatus.textContent = 'Дані успішно збережено';
        storageStatus.className = 'status';
        
        localStorage.setItem('lastUpdateTime', new Date().toLocaleString());
    });
    
    clearDataBtn.addEventListener('click', function() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAge');
        
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userAge').value = '';
        
        storageStatus.textContent = 'Дані очищено';
        storageStatus.className = 'status';
    });
    
    // ========== Налаштування теми та розміру тексту ==========
    const themeButtons = document.querySelectorAll('.theme-btn');
    const fontButtons = document.querySelectorAll('.font-btn');
    
    function loadSettings() {
        const theme = localStorage.getItem('theme') || 'light';
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        
        document.body.classList.remove('dark-theme', 'blue-theme');
        if (theme !== 'light') {
            document.body.classList.add(`${theme}-theme`);
        }
        
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${fontSize}`);
        
        fontButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === fontSize) {
                btn.classList.add('active');
            }
        });
    }
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            document.body.classList.remove('dark-theme', 'blue-theme');
            
            if (theme !== 'light') {
                document.body.classList.add(`${theme}-theme`);
            }
            
            localStorage.setItem('theme', theme);
            
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    fontButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const size = this.dataset.size;
            
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            
            document.body.classList.add(`font-${size}`);
            
            localStorage.setItem('fontSize', size);
            
            fontButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ========== Галерея з кешуванням зображень ==========
    const loadGalleryBtn = document.getElementById('loadGallery');
    const clearGalleryCache = document.getElementById('clearGalleryCache');
    const galleryItems = document.getElementById('galleryItems');
    const cacheStatus = document.getElementById('cacheStatus');
    const loadTime = document.getElementById('loadTime');
    
    function generateImageUrl(id) {
        return `https://picsum.photos/id/${id}/200/150`;
    }
    
    let imageCache = new Map();
    
    async function loadImages() {
        const startTime = performance.now();
        cacheStatus.textContent = 'Завантаження...';
        galleryItems.innerHTML = '';
        
        let fromCache = false;
        if (imageCache.size > 0) {
            fromCache = true;
            cacheStatus.textContent = 'Використовується кеш';
            
            for (let [id, url] of imageCache) {
                const item = createGalleryItem(id, url);
                galleryItems.appendChild(item);
            }
            
            const endTime = performance.now();
            loadTime.textContent = Math.round(endTime - startTime);
        } else {
            cacheStatus.textContent = 'Завантаження нових даних';
            
            for (let i = 1; i <= 10; i++) {
                const id = 100 + i;
                const url = generateImageUrl(id);
                const item = createGalleryItem(id, url);
                galleryItems.appendChild(item);
                
                imageCache.set(id, url);
            }
            
            const endTime = performance.now();
            loadTime.textContent = Math.round(endTime - startTime);
            
            sessionStorage.setItem('imageCacheKeys', JSON.stringify(Array.from(imageCache.keys())));
        }
    }
    
    function createGalleryItem(id, url) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        item.innerHTML = `
            <img src="${url}" alt="Image ${id}" loading="lazy">
            <div class="item-info">Зображення ${id}</div>
        `;
        
        return item;
    }
    
    function clearCache() {
        imageCache.clear();
        sessionStorage.removeItem('imageCacheKeys');
        cacheStatus.textContent = 'Кеш очищено';
        galleryItems.innerHTML = '';
    }
    
    loadGalleryBtn.addEventListener('click', loadImages);
    clearGalleryCache.addEventListener('click', clearCache);
    
    // ========== Динамічний контент з кешуванням API ==========
    const loadPostsBtn = document.getElementById('loadPosts');
    const clearApiCacheBtn = document.getElementById('clearApiCache');
    const postsContainer = document.getElementById('postsContainer');
    const dataSource = document.getElementById('dataSource');
    const apiTime = document.getElementById('apiTime');
    
    const apiCache = new Map();
    
    async function loadPosts() {
        const apiUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=6';
        const cacheKey = 'posts';
        
        const startTime = performance.now();
        postsContainer.innerHTML = '';
        
        try {
            let posts;
            let source;
            
            if (apiCache.has(cacheKey)) {
                posts = apiCache.get(cacheKey);
                source = 'кеш';
                console.log('Дані завантажено з кеша');
            } else {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Помилка завантаження даних');
                }
                
                posts = await response.json();
                apiCache.set(cacheKey, posts);
                localStorage.setItem('postsCache', JSON.stringify(posts));
                localStorage.setItem('postsCacheTime', Date.now());
                source = 'API';
                console.log('Дані завантажено з API');
            }
            
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
            
            const endTime = performance.now();
            
            dataSource.textContent = source;
            apiTime.textContent = Math.round(endTime - startTime);
            
        } catch (error) {
            console.error('Помилка:', error);
            postsContainer.innerHTML = `<div class="error">Помилка завантаження даних: ${error.message}</div>`;
            dataSource.textContent = 'помилка';
            apiTime.textContent = '-';
        }
    }
    
    function createPostElement(post) {
        const element = document.createElement('div');
        element.className = 'post-card';
        
        element.innerHTML = `
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.body}</p>
        `;
        
        return element;
    }
    
    function clearApiCache() {
        apiCache.clear();
        localStorage.removeItem('postsCache');
        localStorage.removeItem('postsCacheTime');
        dataSource.textContent = '-';
        apiTime.textContent = '-';
        postsContainer.innerHTML = '';
    }
    
    loadPostsBtn.addEventListener('click', loadPosts);
    clearApiCacheBtn.addEventListener('click', clearApiCache);
    
    function loadCachedPosts() {
        const cachedPosts = localStorage.getItem('postsCache');
        const cacheTime = localStorage.getItem('postsCacheTime');
        
        if (cachedPosts && cacheTime) {
            const now = Date.now();
            const cacheAge = now - parseInt(cacheTime);
            const maxAge = 24 * 60 * 60 * 1000;
            
            if (cacheAge < maxAge) {
                try {
                    const posts = JSON.parse(cachedPosts);
                    apiCache.set('posts', posts);
                    console.log('Кеш постів завантажено з localStorage');
                } catch (error) {
                    console.error('Помилка парсингу кеша:', error);
                    localStorage.removeItem('postsCache');
                }
            } else {
                localStorage.removeItem('postsCache');
                localStorage.removeItem('postsCacheTime');
                console.log('Кеш постів застарів і буде оновлений');
            }
        }
    }
    
    // ========== Ініціалізація при завантаженні сторінки ==========
    loadUserData();
    loadSettings();
    loadCachedPosts();
    
    setInterval(function() {
        const startTime = parseInt(sessionStorage.getItem('sessionStartTime'));
        const now = Date.now();
        const sessionDuration = Math.floor((now - startTime) / 1000);
        sessionStorage.setItem('sessionDuration', sessionDuration);
    }, 1000);
}); 