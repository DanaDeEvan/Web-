document.addEventListener('DOMContentLoaded', () => {
    const progressiveImages = document.querySelectorAll('.progressive-image');
    
    progressiveImages.forEach(container => {
        const fullImage = container.querySelector('.reveal-image');
        const placeholder = container.querySelector('.placeholder');
        
        if (fullImage && placeholder) {
            fullImage.addEventListener('load', () => {
                setTimeout(() => {
                    fullImage.classList.add('loaded');
                    placeholder.classList.add('loaded');
                }, 100);
            });
            
            if (fullImage.complete) {
                fullImage.classList.add('loaded');
                placeholder.classList.add('loaded');
            }
        }
    });
    
    if ('loading' in HTMLImageElement.prototype) {
        console.log('Браузер підтримує нативний lazy loading');
    } else {
        console.log('Браузер не підтримує нативний lazy loading, використовуємо IntersectionObserver');
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                    }
                    
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.removeAttribute('data-srcset');
                    }
                    
                    lazyImage.classList.add('loaded');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

window.addEventListener('resize', () => {
    const widthDisplay = document.getElementById('current-width');
    if (widthDisplay) {
        widthDisplay.textContent = window.innerWidth + 'px';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const responsiveSection = document.querySelector('.responsive-example');
    
    if (responsiveSection) {
        const infoElement = document.createElement('div');
        infoElement.className = 'current-size-info';
        infoElement.innerHTML = `
            <p>Поточна ширина вікна: <span id="current-width">${window.innerWidth}px</span></p>
            <p class="size-explanation">Ця інформація допомагає зрозуміти, яке зображення вибрав браузер на основі атрибутів srcset і sizes.</p>
        `;
        
        responsiveSection.appendChild(infoElement);
    }
    
    window.dispatchEvent(new Event('resize'));
});

(function() {
    const checkWebpSupport = () => {
        const webpImage = new Image();
        
        webpImage.onload = function() {
            const supportClass = (webpImage.width === 1) ? 'webp-support' : 'no-webp-support';
            document.documentElement.classList.add(supportClass);
        };
        
        webpImage.onerror = function() {
            document.documentElement.classList.add('no-webp-support');
        };
        
        webpImage.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    };
    
    checkWebpSupport();
})(); 