document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.getElementById('menuContainer');
    const burgerKnopka = document.querySelector('.knopka_burger');
    const golovneMenyu = document.getElementById('mainNavContainer');

    function stvorytyPunktMenyu(itemData) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = itemData.title;
        link.href = itemData.link || '#';
        link.setAttribute('role', 'menuitem'); 

        li.appendChild(link);

        if (itemData.submenu && itemData.submenu.length > 0) {
            const pidmenyuUl = document.createElement('ul');
            pidmenyuUl.setAttribute('role', 'menu'); 
            link.setAttribute('aria-haspopup', 'true'); 

            itemData.submenu.forEach(subItem => {
                pidmenyuUl.appendChild(stvorytyPunktMenyu(subItem));
            });
            li.appendChild(pidmenyuUl);

            link.addEventListener('click', function(event) {
                if (window.innerWidth <= 768) { 
                    event.preventDefault(); 
                    li.classList.toggle('open');
                }
            });

            if (window.innerWidth > 768) {
                li.addEventListener('mouseenter', function() {
                    li.classList.add('hovered');
                });
                li.addEventListener('mouseleave', function() {
                    li.classList.remove('hovered');
                });
            }
        }

        return li;
    }

    if (menuData && menuData.items && menuContainer) {
        menuContainer.setAttribute('role', 'menubar'); 
        menuData.items.forEach(item => {
            menuContainer.appendChild(stvorytyPunktMenyu(item));
        });
    }

    if (burgerKnopka && golovneMenyu && menuContainer) {
        burgerKnopka.addEventListener('click', function() {
            golovneMenyu.classList.toggle('active');
            menuContainer.classList.toggle('active');
            burgerKnopka.classList.toggle('active');
            if (!menuContainer.classList.contains('active')) {
                 const openSubmenus = menuContainer.querySelectorAll('li.open');
                 openSubmenus.forEach(sub => sub.classList.remove('open'));
            }
        });
    }

    const shlyah = window.location.hash;
    if (shlyah) {
        const aktyvnePosylannya = menuContainer.querySelector(`a[href="${shlyah}"]`);
        if (aktyvnePosylannya) {
            aktyvnePosylannya.classList.add('aktyvnyi_punkt');
            let parentUl = aktyvnePosylannya.closest('ul');
            while(parentUl && parentUl !== menuContainer) {
                 const parentLi = parentUl.closest('li');
                 if (parentLi) {
                     parentLi.classList.add('open'); 
                 }
                 parentUl = parentLi ? parentLi.closest('ul') : null; 
            }
        }
    }

}); 