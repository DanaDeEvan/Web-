const burgerKnopka = document.getElementById('mobileMenuToggle');
const golovnaNav = document.getElementById('mainNav');

burgerKnopka.addEventListener('click', function() {
    golovnaNav.classList.toggle('active');
    burgerKnopka.classList.toggle('active');
});


const dropdowns = document.querySelectorAll('.punkt_z_pidmenyu');

dropdowns.forEach(function(item) {
    const link = item.querySelector('a');
     link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) { 
             e.preventDefault(); 
            item.classList.toggle('active');
        }
    });

    
    if (window.innerWidth > 768) {
         item.addEventListener('mouseenter', function() {
             item.classList.add('hovered'); 
        });
          item.addEventListener('mouseleave', function() {
            item.classList.remove('hovered'); 
        });
    }
}); 