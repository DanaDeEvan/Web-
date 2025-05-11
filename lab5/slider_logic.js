document.addEventListener('DOMContentLoaded', function() {
    const sliderKon = document.getElementById('myImageSlider');
    const slajdyKon = document.getElementById('slidesContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsKon = document.getElementById('dotsContainer');
    const likhylnyk = document.getElementById('slideCounter');
    const autoplayKnopka = document.getElementById('autoplayToggle');

    const slajdy = slajdyKon ? slajdyKon.querySelectorAll('.slajd') : [];
    const kilkistSlajdiv = slajdy.length;
    let aktyvnyiIndeks = 0; 
    let autoplayInterval;
    let isAutoplayRunning = true;   

    if (kilkistSlajdiv === 0 || !slajdyKon) return; 

    function pokazatySlajd(indeks) {
        aktyvnyiIndeks = (indeks + kilkistSlajdiv) % kilkistSlajdiv;
        const zmishennya = -aktyvnyiIndeks * 100;
        slajdyKon.style.transform = `translateX(${zmishennya}%)`;

        vidnovytyTochky();
        vidnovytyLikhylnyk();
    }

    function vidnovytyTochky() {
        if (!dotsKon) return;
        dotsKon.innerHTML = ''; 
        for (let i = 0; i < kilkistSlajdiv; i++) {
            const tochka = document.createElement('span');
            tochka.classList.add('tochka');
            tochka.setAttribute('data-index', i); 
            if (i === aktyvnyiIndeks) {
                tochka.classList.add('aktyvna');
            }
            tochka.addEventListener('click', function() {
                pokazatySlajd(parseInt(this.getAttribute('data-index'))); 
                pynytyAutoplay(); 
            });
            dotsKon.appendChild(tochka);
        }
    }

    function vidnovytyLikhylnyk() {
        if (likhylnyk) {
            likhylnyk.textContent = `${aktyvnyiIndeks + 1} / ${kilkistSlajdiv}`;
        }
    }

    function nastupnyiSlajd() {
        pokazatySlajd(aktyvnyiIndeks + 1);
    }

    function poperednyiSlajd() {
        pokazatySlajd(aktyvnyiIndeks - 1);
    }

    function zapustytyAutoplay() {
        if (!isAutoplayRunning) { 
             isAutoplayRunning = true;
             autoplayKnopka.textContent = 'Пауза';
            autoplayInterval = setInterval(nastupnyiSlajd, 3000); 
        }
    }

    function pynytyAutoplay() {
        if (isAutoplayRunning) {
             isAutoplayRunning = false;
             autoplayKnopka.textContent = 'Старт';
             clearInterval(autoplayInterval);
        }
    }

    if (prevBtn) { 
         prevBtn.addEventListener('click', function(){
             poperednyiSlajd();
             pynytyAutoplay(); 
         });
    }

    if (nextBtn) {
         nextBtn.addEventListener('click', function(){
             nastupnyiSlajd();
             pynytyAutoplay(); 
         });
    }

    if (autoplayKnopka) {
         autoplayKnopka.addEventListener('click', function(){
             if (isAutoplayRunning) {
                 pynytyAutoplay();
             } else {
                 zapustytyAutoplay();
             }
         });
    }


    vidnovytyTochky(); 
    vidnovytyLikhylnyk(); 
    pokazatySlajd(aktyvnyiIndeks); 
    zapustytyAutoplay(); 


}); 