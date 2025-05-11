document.addEventListener('DOMContentLoaded', function() {

    // Modalka
    const modalneOkno = document.getElementById('myModal');
    const knopkaVidkryty = document.getElementById('vidkrytyModalku');
    const spanZakryty = document.querySelector('.modalka .zakryty');

    if (knopkaVidkryty && modalneOkno) {
        knopkaVidkryty.onclick = function() {
            modalneOkno.style.display = 'block';
        }
    }

    if (spanZakryty && modalneOkno) {
        spanZakryty.onclick = function() {
            modalneOkno.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target == modalneOkno) {
            modalneOkno.style.display = 'none';
        }
    }

    // Forma zvorotnogo zvyazku
    const formaKontaktiv = document.getElementById('kontaktForma');
    if (formaKontaktiv) {
        formaKontaktiv.addEventListener('submit', function(eventObjekt) {
            eventObjekt.preventDefault();
            const imyaPolyaInput = document.getElementById('imyaPolya');
            const emailPolyaInput = document.getElementById('emailPolya');
            const povidomlennyaPolyaTextarea = document.getElementById('povidomlennyaPolya');
            let isValid = true;
            let pomylkaText = '';

            if (!imyaPolyaInput.value.trim()) {
                isValid = false;
                pomylkaText += 'Ім\'я є обов\'язковим.\n';
                imyaPolyaInput.style.borderColor = 'red';
            } else {
                imyaPolyaInput.style.borderColor = '#ccc';
            }

            if (!emailPolyaInput.value.trim()) {
                isValid = false;
                pomylkaText += 'Email є обов\'язковим.\n';
                emailPolyaInput.style.borderColor = 'red';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPolyaInput.value)) {
                isValid = false;
                pomylkaText += 'Неправильний формат Email.\n';
                emailPolyaInput.style.borderColor = 'red';
            } else {
                emailPolyaInput.style.borderColor = '#ccc';
            }

            if (!povidomlennyaPolyaTextarea.value.trim()) {
                isValid = false;
                pomylkaText += 'Повідомлення не може бути порожнім.\n';
                povidomlennyaPolyaTextarea.style.borderColor = 'red';
            } else {
                povidomlennyaPolyaTextarea.style.borderColor = '#ccc';
            }

            if (isValid) {
                alert('Форму успішно відправлено! (імітація)');
                formaKontaktiv.reset();
                imyaPolyaInput.style.borderColor = '#ccc';
                emailPolyaInput.style.borderColor = '#ccc';
                povidomlennyaPolyaTextarea.style.borderColor = '#ccc';
            } else {
                alert('Помилки у формі:\n' + pomylkaText);
            }
        });
    }

    // Galereya kartynok (prostyy efekt pry kliku)
    const kartynkyGalereyi = document.querySelectorAll('.kartynka-galereyi');
    kartynkyGalereyi.forEach(function(kartynka) {
        kartynka.addEventListener('click', function() {
            // Prosto zminyuyemo ramku kartynky pry kliku
            if (kartynka.style.border === '3px solid blue') {
                 kartynka.style.border = '1px solid #ddd';
            } else {
                 kartynka.style.border = '3px solid blue';
            }
            // V idealnomu sviti, tut by bulo vidkryttya u modali abo povnotsinna galereya
        });
    });

    // Vypadayuche menyu
    const knopkaMenu = document.getElementById('menyuKnopka');
    const zmistMenyuDiv = document.getElementById('vypadMenyu');

    if (knopkaMenu && zmistMenyuDiv) {
        knopkaMenu.addEventListener('click', function() {
            zmistMenyuDiv.style.display = zmistMenyuDiv.style.display === 'block' ? 'none' : 'block';
        });

        // Zakryty menyu, iakscho klatsnuty poza nym
        document.addEventListener('click', function(event) {
            if (!knopkaMenu.contains(event.target) && !zmistMenyuDiv.contains(event.target)) {
                zmistMenyuDiv.style.display = 'none';
            }
        });
    }
    
    // Knopka "vgoru"
    const knopkaVgoruBtn = document.getElementById('knopka_vgoru');

    if(knopkaVgoruBtn){
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                knopkaVgoruBtn.style.display = 'block';
            } else {
                knopkaVgoruBtn.style.display = 'none';
            }
        };

        knopkaVgoruBtn.addEventListener('click', function(){
            document.body.scrollTop = 0; // Dlya Safari
            document.documentElement.scrollTop = 0; // Dlya Chrome, Firefox, IE and Opera
        });
    }
}); 