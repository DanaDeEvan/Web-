document.addEventListener('DOMContentLoaded', function() {
    
    // Lazy loading для зображень
    const zobrazhennya = document.querySelectorAll('img[loading="lazy"]');
    
    // Перевірка підтримки lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Браузер підтримує нативний lazy loading
        zobrazhennya.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    } else {
        // Fallback для старих браузерів
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        zobrazhennya.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Перевірка підтримки WebP
    function perevirkaWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Застосування WebP якщо підтримується
    perevirkaWebP().then(hasWebP => {
        if (!hasWebP) {
            // Заміна WebP на fallback формати
            const sources = document.querySelectorAll('source[type="image/webp"]');
            sources.forEach(source => {
                source.remove();
            });
        }
    });

    // Анімація для іконок
    const ikonky = document.querySelectorAll('.blok_ikonky');
    
    ikonky.forEach(blok => {
        blok.addEventListener('mouseenter', function() {
            const ikonka = this.querySelector('.ikonka');
            if (ikonka) {
                ikonka.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        blok.addEventListener('mouseleave', function() {
            const ikonka = this.querySelector('.ikonka');
            if (ikonka) {
                ikonka.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Обробка помилок завантаження зображень
    zobrazhennya.forEach(img => {
        img.addEventListener('error', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.border = '2px dashed #dee2e6';
            this.alt = 'Зображення не завантажилось';
            
            // Створення placeholder тексту
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #6c757d;
                font-size: 14px;
                text-align: center;
            `;
            placeholder.textContent = 'Зображення недоступне';
            
            this.parentElement.style.position = 'relative';
            this.parentElement.appendChild(placeholder);
        });
    });

    // Статистика завантаження
    let zavantazheniZobrazhennya = 0;
    let zagalnaKilkist = zobrazhennya.length;

    zobrazhennya.forEach(img => {
        img.addEventListener('load', function() {
            zavantazheniZobrazhennya++;
            
            if (zavantazheniZobrazhennya === zagalnaKilkist) {
                console.log('Всі зображення завантажені успішно!');
                
                // Показати повідомлення про завершення завантаження
                pokazatyPovidomlennya('Всі зображення завантажені! 🎉');
            }
        });
    });

    // Функція показу повідомлення
    function pokazatyPovidomlennya(tekst) {
        const povidomlennya = document.createElement('div');
        povidomlennya.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        povidomlennya.textContent = tekst;
        
        document.body.appendChild(povidomlennya);
        
        // Анімація появи
        setTimeout(() => {
            povidomlennya.style.opacity = '1';
            povidomlennya.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматичне приховування
        setTimeout(() => {
            povidomlennya.style.opacity = '0';
            povidomlennya.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                document.body.removeChild(povidomlennya);
            }, 300);
        }, 3000);
    }

    // Оптимізація для мобільних пристроїв
    function optimizaciyaDlyaMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Зменшення якості зображень на мобільних
            zobrazhennya.forEach(img => {
                const src = img.src;
                if (src.includes('picsum.photos')) {
                    // Зменшуємо розмір для мобільних
                    img.src = src.replace(/\d+x\d+/, '640x360');
                }
            });
        }
    }

    // Виклик оптимізації при завантаженні та зміні розміру
    optimizaciyaDlyaMobile();
    window.addEventListener('resize', optimizaciyaDlyaMobile);

    // Попереднє завантаження критичних ресурсів
    function poperednjeZavantazhennya() {
        const criticalImages = [
            'https://picsum.photos/800/450?random=1',
            'https://picsum.photos/800/450?random=2'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    poperednjeZavantazhennya();

    // Моніторинг продуктивності
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime + 'ms');
                }
            });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
});
