// Лабораторна робота №8 - Оптимізація зображень JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Ініціалізація всіх функцій
    initLazyLoading();
    initProgressiveLoading();
    initWebPSupport();
    initImagePreloading();
    initStatCounters();
    initAOSAnimations();
    initPerformanceMonitoring();
    
    console.log('🚀 Система оптимізації зображень ініціалізована');
});

// Lazy Loading з Intersection Observer
function initLazyLoading() {
    // Перевірка підтримки Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // Fallback для старих браузерів
        loadAllImages();
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        // Завантажувати зображення за 50px до появи в viewport
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Обробка всіх lazy зображень
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Завантаження зображення з плавним переходом
function loadImage(img) {
    return new Promise((resolve, reject) => {
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Оновлення src
            img.src = img.dataset.src;
            img.classList.add('loaded');
            
            // Видалення data-src атрибуту
            img.removeAttribute('data-src');
            
            // Додавання fade-in ефекту
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease-in-out';
            
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
            
            resolve(img);
            console.log('✅ Зображення завантажено:', img.alt);
        };
        
        imageLoader.onerror = () => {
            // Fallback зображення при помилці
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EПомилка завантаження%3C/text%3E%3C/svg%3E';
            img.classList.add('error');
            reject(new Error('Помилка завантаження зображення'));
        };
        
        // Початок завантаження
        imageLoader.src = img.dataset.src;
    });
}

// Fallback для старих браузерів
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
    console.log('📱 Fallback: всі зображення завантажені');
}

// Прогресивне завантаження
function initProgressiveLoading() {
    const progressiveImages = document.querySelectorAll('.progressive_image');
    
    progressiveImages.forEach(img => {
        // Спочатку завантажуємо низькоякісну версію
        if (img.dataset.srcLowres) {
            loadLowResImage(img);
        }
        
        // Потім завантажуємо високоякісну версію
        setTimeout(() => {
            loadHighResImage(img);
        }, 100);
    });
}

function loadLowResImage(img) {
    const lowResLoader = new Image();
    lowResLoader.onload = () => {
        img.src = img.dataset.srcLowres;
        img.style.filter = 'blur(10px)';
    };
    lowResLoader.src = img.dataset.srcLowres;
}

function loadHighResImage(img) {
    const highResLoader = new Image();
    const loadingOverlay = img.parentElement.querySelector('.loading_overlay');
    
    highResLoader.onload = () => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        
        // Приховування overlay
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
        
        console.log('🎨 Прогресивне зображення завантажено');
    };
    
    highResLoader.onerror = () => {
        if (loadingOverlay) {
            loadingOverlay.innerHTML = '<p style="color: #e74c3c;">Помилка завантаження</p>';
        }
    };
    
    highResLoader.src = img.dataset.src;
}

// Перевірка підтримки WebP
function initWebPSupport() {
    // Створюємо маленьке WebP зображення для тестування
    const webpTest = new Image();
    webpTest.onload = webpTest.onerror = function() {
        const hasWebPSupport = webpTest.height === 2;
        
        if (hasWebPSupport) {
            document.documentElement.classList.add('webp-support');
            console.log('✅ WebP підтримується');
        } else {
            document.documentElement.classList.add('no-webp-support');
            console.log('❌ WebP не підтримується');
        }
        
        // Оновлення статистики підтримки
        updateBrowserSupportStats(hasWebPSupport);
    };
    
    // WebP тестове зображення (2x2 пікселі)
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

// Попереднє завантаження критичних зображень
function initImagePreloading() {
    const criticalImages = [
        'https://picsum.photos/50/50?random=1'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    console.log('⚡ Критичні зображення попередньо завантажені');
}

// Анімація лічильників статистики
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat_number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                animateCounter(element, target);
                counterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 секунди
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

// Простий AOS (Animate On Scroll)
function initAOSAnimations() {
    const animateElements = document.querySelectorAll('[data-aos]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Моніторинг продуктивності
function initPerformanceMonitoring() {
    // Вимірювання Core Web Vitals
    measureLCP();
    measureFID();
    measureCLS();
    
    // Загальна статистика завантаження
    window.addEventListener('load', () => {
        setTimeout(() => {
            logPerformanceMetrics();
        }, 1000);
    });
}

// Largest Contentful Paint
function measureLCP() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📊 LCP:', lastEntry.startTime.toFixed(2) + 'ms');
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

// First Input Delay
function measureFID() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('📊 FID:', entry.processingStart - entry.startTime + 'ms');
            });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }
}

// Cumulative Layout Shift
function measureCLS() {
    if ('PerformanceObserver' in window) {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('📊 CLS:', clsValue.toFixed(4));
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }
}

// Логування метрик продуктивності
function logPerformanceMetrics() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        console.log('📈 Метрики продуктивності:');
        console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.navigationStart + 'ms');
        console.log('Load Event:', navigation.loadEventEnd - navigation.navigationStart + 'ms');
        
        paint.forEach(entry => {
            console.log(entry.name + ':', entry.startTime.toFixed(2) + 'ms');
        });
        
        // Кількість завантажених зображень
        const images = document.querySelectorAll('img');
        const loadedImages = document.querySelectorAll('img.loaded');
        console.log(`🖼️ Зображення: ${loadedImages.length}/${images.length} завантажено`);
    }
}

// Оновлення статистики підтримки браузерів
function updateBrowserSupportStats(hasWebP) {
    const supportPercentage = hasWebP ? 96 : 85; // Приблизна статистика
    const supportStat = document.querySelector('.stat_card:last-child .stat_number');
    
    if (supportStat) {
        supportStat.dataset.target = supportPercentage;
    }
}

// Утиліти для роботи з зображеннями
const ImageOptimization = {
    // Генерація responsive srcset
    generateSrcset: function(baseUrl, sizes) {
        return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
    },
    
    // Визначення оптимального розміру зображення
    getOptimalImageSize: function(containerWidth, devicePixelRatio = 1) {
        const sizes = [400, 600, 800, 1200, 1600, 2000];
        const targetWidth = containerWidth * devicePixelRatio;
        
        return sizes.find(size => size >= targetWidth) || sizes[sizes.length - 1];
    },
    
    // Перевірка підтримки форматів
    supportedFormats: {
        webp: false,
        avif: false,
        jp2: false
    },
    
    // Ініціалізація перевірки форматів
    checkFormatSupport: function() {
        // WebP
        this.checkWebP().then(supported => {
            this.supportedFormats.webp = supported;
        });
        
        // AVIF (якщо потрібно)
        this.checkAVIF().then(supported => {
            this.supportedFormats.avif = supported;
        });
    },
    
    checkWebP: function() {
        return new Promise((resolve) => {
            const webp = new Image();
            webp.onload = webp.onerror = function() {
                resolve(webp.height === 2);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },
    
    checkAVIF: function() {
        return new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = function() {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }
};

// Ініціалізація перевірки форматів
ImageOptimization.checkFormatSupport();

// Експорт функцій для можливого використання ззовні
window.ImageOptimization = ImageOptimization;
