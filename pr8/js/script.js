document.addEventListener('DOMContentLoaded', function() {
    let svgIcons = document.querySelectorAll('svg use');
    svgIcons.forEach(function(icon) {
        let iconHref = icon.getAttribute('xlink:href');
        if (iconHref) {
            let svgSpritePath = iconHref.split('#')[0];
            let spriteId = iconHref.split('#')[1];
            
            let tempImg = new Image();
            tempImg.onload = function() {
                console.log('SVG спрайт завантажено успішно: ' + svgSpritePath);
            };
            
            tempImg.onerror = function() {
                console.error('Помилка завантаження SVG спрайту: ' + svgSpritePath);
                
                let svgParent = icon.closest('svg');
                if (svgParent && spriteId) {
                    let fallbackIcon = '';
                    
                    if (spriteId === 'icon-home') {
                        fallbackIcon = '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>';
                    } else if (spriteId === 'icon-search') {
                        fallbackIcon = '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>';
                    } else if (spriteId === 'icon-user') {
                        fallbackIcon = '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>';
                    } else if (spriteId === 'icon-settings') {
                        fallbackIcon = '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>';
                    }
                    
                    if (fallbackIcon) {
                        svgParent.innerHTML = fallbackIcon;
                        svgParent.setAttribute('viewBox', '0 0 24 24');
                        console.log('Застосовано запасний варіант для іконки: ' + spriteId);
                    }
                }
            };
            
            tempImg.src = svgSpritePath;
        }
    });

    let lazyImages = document.querySelectorAll('img[loading="lazy"]');
    let imagesToLoad = lazyImages.length;
    let imagesLoaded = 0;
    
    lazyImages.forEach(function(img) {
        if (img.complete) {
            imageDone();
        } else {
            img.addEventListener('load', imageDone);
            img.addEventListener('error', imageDone);
        }
    });
    
    function imageDone() {
        imagesLoaded++;
        let percentLoaded = Math.round((imagesLoaded / imagesToLoad) * 100);
        
        if (imagesLoaded === imagesToLoad) {
            console.log('Всі зображення завантажено');
        }
    }
    
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        let scrollText = document.querySelector('.lazy-example p');
        let originalText = scrollText.textContent;
        
        scrollContainer.addEventListener('scroll', function() {
            let scrollAmount = Math.floor((scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight)) * 100);
            
            if (scrollAmount > 0) {
                scrollText.textContent = `Прокручено: ${scrollAmount}% - зображення завантажуються при прокрутці`;
            } else {
                scrollText.textContent = originalText;
            }
        });
    }
    
    let format = {
        jpeg: 'JPEG використовує стиснення з втратами для фотографій',
        png: 'PNG забезпечує високу якість без втрат для графіки',
        webp: 'WebP пропонує кращу компресію порівняно з JPEG та PNG',
        svg: 'SVG - це векторний формат, який масштабується без втрати якості'
    };
    
    let formatContainers = document.querySelectorAll('.format-example');
    formatContainers.forEach(function(container) {
        let heading = container.querySelector('h3').textContent.toLowerCase();
        
        container.addEventListener('mouseenter', function() {
            let key = '';
            if (heading.includes('jpeg')) key = 'jpeg';
            else if (heading.includes('png')) key = 'png';
            else if (heading.includes('webp')) key = 'webp';
            else if (heading.includes('svg')) key = 'svg';
            
            if (key && format[key]) {
                let infoBox = document.createElement('div');
                infoBox.className = 'format-info-popup';
                infoBox.textContent = format[key];
                infoBox.style.position = 'absolute';
                infoBox.style.backgroundColor = '#3a6ea5';
                infoBox.style.color = 'white';
                infoBox.style.padding = '10px';
                infoBox.style.borderRadius = '5px';
                infoBox.style.top = '0';
                infoBox.style.right = '0';
                infoBox.style.zIndex = '100';
                infoBox.style.maxWidth = '200px';
                
                let imageContainer = container.querySelector('.image-container');
                if (imageContainer) {
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(infoBox);
                }
            }
        });
        
        container.addEventListener('mouseleave', function() {
            let infoBox = container.querySelector('.format-info-popup');
            if (infoBox) {
                infoBox.remove();
            }
        });
    });
}); 