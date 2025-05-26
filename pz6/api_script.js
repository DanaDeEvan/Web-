document.addEventListener('DOMContentLoaded', function() {
    const poshukInput = document.getElementById('poshuk_input');
    const poshukKnopka = document.getElementById('poshuk_knopka');
    const ochystytyKnopka = document.getElementById('ochistyty_knopka');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error_message');
    const dataContainer = document.getElementById('data_container');
    const prevBtn = document.getElementById('prev_btn');
    const nextBtn = document.getElementById('next_btn');
    const pageInfo = document.getElementById('page_info');

    let vseDani = [];
    const USERS_NA_STORINKU = 6;
    let potochnaStorinka = 1;
    let filtrovaniDani = [];

    // Завантаження даних з API
    async function zavantazhytyDani() {
        pokazatyLoader(true);
        skrytyPomylku();

        try {
            // Перевіряємо локальне сховище
            const cachedData = localStorage.getItem('usersData');
            if (cachedData) {
                vseDani = JSON.parse(cachedData);
                filtrovaniDani = [...vseDani];
                pokazatyDani();
                pokazatyLoader(false);
                return;
            }

            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error(`HTTP помилка! статус: ${response.status}`);
            }

            const dani = await response.json();
            vseDani = dani;
            filtrovaniDani = [...vseDani];
            
            // Зберігаємо в локальне сховище
            localStorage.setItem('usersData', JSON.stringify(dani));
            
            pokazatyDani();
        } catch (error) {
            pokazatyPomylku('Помилка завантаження даних: ' + error.message);
        } finally {
            pokazatyLoader(false);
        }
    }

    function pokazatyLoader(pokazaty) {
        if (pokazaty) {
            loader.classList.remove('hidden');
            dataContainer.innerHTML = '';
        } else {
            loader.classList.add('hidden');
        }
    }

    function pokazatyPomylku(text) {
        errorMessage.textContent = text;
        errorMessage.classList.remove('hidden');
    }

    function skrytyPomylku() {
        errorMessage.classList.add('hidden');
    }

    function pokazatyDani() {
        const startIndex = (potochnaStorinka - 1) * USERS_NA_STORINKU;
        const endIndex = startIndex + USERS_NA_STORINKU;
        const danidlyaStorinky = filtrovaniDani.slice(startIndex, endIndex);

        if (danidlyaStorinky.length === 0) {
            dataContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Дані не знайдено</p>';
        } else {
            dataContainer.innerHTML = danidlyaStorinky.map(user => `
                <div class="kartka_korystuvacha">
                    <div class="imya_korystuvacha">${user.name}</div>
                    <div class="email_korystuvacha">${user.email}</div>
                    <div class="informaciya_korystuvacha">
                        <strong>Телефон:</strong> ${user.phone}<br>
                        <strong>Сайт:</strong> ${user.website}<br>
                        <strong>Місто:</strong> ${user.address.city}
                    </div>
                </div>
            `).join('');
        }

        vidnovytypaginatsiyu();
    }

    function vidnovytypaginatsiyu() {
        const vsyogoStorinok = Math.ceil(filtrovaniDani.length / USERS_NA_STORINKU);
        
        prevBtn.disabled = potochnaStorinka <= 1;
        nextBtn.disabled = potochnaStorinka >= vsyogoStorinok;
        
        pageInfo.textContent = `Сторінка ${potochnaStorinka} з ${vsyogoStorinok}`;
    }

    function poshuk() {
        const zapyt = poshukInput.value.toLowerCase().trim();
        
        if (zapyt === '') {
            filtrovaniDani = [...vseDani];
        } else {
            filtrovaniDani = vseDani.filter(user => 
                user.name.toLowerCase().includes(zapyt) ||
                user.email.toLowerCase().includes(zapyt) ||
                user.phone.includes(zapyt)
            );
        }
        
        potochnaStorinka = 1;
        pokazatyDani();
    }

    function ochystyty() {
        poshukInput.value = '';
        filtrovaniDani = [...vseDani];
        potochnaStorinka = 1;
        pokazatyDani();
    }

    // Обробники подій
    if (poshukKnopka) {
        poshukKnopka.addEventListener('click', poshuk);
    }

    if (ochystytyKnopka) {
        ochystytyKnopka.addEventListener('click', ochystyty);
    }

    if (poshukInput) {
        poshukInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                poshuk();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (potochnaStorinka > 1) {
                potochnaStorinka--;
                pokazatyDani();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const vsyogoStorinok = Math.ceil(filtrovaniDani.length / USERS_NA_STORINKU);
            if (potochnaStorinka < vsyogoStorinok) {
                potochnaStorinka++;
                pokazatyDani();
            }
        });
    }

    // Ініціалізація
    zavantazhytyDani();
});
