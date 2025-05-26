// Лабораторна робота №9 - Оптимізація продуктивності JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    initLazyLoading();
    initPerformanceMetrics();
    initCacheInfo();
    initTestButton();
    
    console.log('Скрипт завантажено асинхронно і готовий до роботи');
});

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy_image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

function initPerformanceMetrics() {
    window.addEventListener('load', function() {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        if (navigation) {
            const domTime = Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            const loadTime = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
            
            document.getElementById('domTime').textContent = domTime + ' мс';
            document.getElementById('loadTime').textContent = loadTime + ' мс';
        }
    });
}

function initCacheInfo() {
    const cacheInfo = document.getElementById('cacheInfo');
    
    if ('caches' in window) {
        cacheInfo.innerHTML = `
            <strong>Кешування активне:</strong><br>
            • CSS файли кешуються браузером<br>
            • JavaScript завантажується асинхронно<br>
            • Зображення завантажуються за потребою
        `;
    } else {
        cacheInfo.innerHTML = `
            <strong>Базове кешування:</strong><br>
            • Використовується стандартне кешування браузера
        `;
    }
}

function initTestButton() {
    const testBtn = document.getElementById('testBtn');
    
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            this.textContent = 'Кнопка натиснута!';
            this.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                this.textContent = 'Тестова кнопка';
                this.style.background = '';
            }, 2000);
        });
    }
}

function trackPerformance() {
    if ('performance' in window) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log('Час завантаження сторінки:', pageLoadTime + ' мс');
    }
}

window.addEventListener('load', trackPerformance);
