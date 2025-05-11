document.addEventListener('DOMContentLoaded', function() {
    const formaRegistracii = document.getElementById('registrationForm');

    const inputUsername = document.getElementById('username');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const inputConfirmPassword = document.getElementById('confirmPassword');
    const inputPhone = document.getElementById('phone');
    const inputBirthDate = document.getElementById('birthDate');
    const inputTerms = document.getElementById('terms');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const phoneError = document.getElementById('phoneError');
    const birthDateError = document.getElementById('birthDateError');
    const termsError = document.getElementById('termsError');

    if (formaRegistracii) {
        formaRegistracii.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValidForm = true;

            if (inputUsername.value.trim() === '') {
                usernameError.textContent = "Ім'я користувача є обов'язковим.";
                inputUsername.style.borderColor = 'red';
                isValidForm = false;
            } else {
                usernameError.textContent = '';
                inputUsername.style.borderColor = '#ddd';
            }

            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (inputEmail.value.trim() === '') {
                emailError.textContent = 'Email є обов\'язковим.';
                inputEmail.style.borderColor = 'red';
                isValidForm = false;
            } else if (!emailRegex.test(inputEmail.value.trim())) {
                emailError.textContent = 'Неправильний формат email.';
                inputEmail.style.borderColor = 'red';
                isValidForm = false;
            } else {
                emailError.textContent = '';
                inputEmail.style.borderColor = '#ddd';
            }

            const passwordValue = inputPassword.value;
            if (passwordValue.length < 8) {
                passwordError.textContent = 'Пароль має містити щонайменше 8 символів.';
                inputPassword.style.borderColor = 'red';
                isValidForm = false;
            } else if (!/[A-Z]/.test(passwordValue)) {
                passwordError.textContent = 'Пароль має містити хоча б одну велику літеру.';
                inputPassword.style.borderColor = 'red';
                isValidForm = false;
            } else if (!/\d/.test(passwordValue)) {
                passwordError.textContent = 'Пароль має містити хоча б одну цифру.';
                inputPassword.style.borderColor = 'red';
                isValidForm = false;
            } else {
                passwordError.textContent = '';
                inputPassword.style.borderColor = '#ddd';
            }

            if (inputConfirmPassword.value !== passwordValue) {
                confirmPasswordError.textContent = 'Паролі не співпадають.';
                inputConfirmPassword.style.borderColor = 'red';
                isValidForm = false;
            } else if (inputConfirmPassword.value === '' && passwordValue !== ''){
                confirmPasswordError.textContent = 'Підтвердьте пароль.';
                 inputConfirmPassword.style.borderColor = 'red';
                isValidForm = false;
            }else {
                confirmPasswordError.textContent = '';
                inputConfirmPassword.style.borderColor = '#ddd';
            }

            const phoneRegex = /^\+380\d{9}$/;
            if (inputPhone.value.trim() !== '' && !phoneRegex.test(inputPhone.value.trim())) {
                phoneError.textContent = 'Неправильний формат телефону (приклад: +380xxxxxxxxx).';
                inputPhone.style.borderColor = 'red';
                isValidForm = false;
            } else if (inputPhone.value.trim() === '') {
                 phoneError.textContent = 'Телефон є обов\'язковим полем.';
                inputPhone.style.borderColor = 'red';
                 isValidForm = false;
            }else {
                phoneError.textContent = '';
                inputPhone.style.borderColor = '#ddd';
            }

            if (inputBirthDate.value === '') {
                birthDateError.textContent = 'Дата народження є обов\'язковою.';
                inputBirthDate.style.borderColor = 'red';
                isValidForm = false;
            } else {
                const birthDate = new Date(inputBirthDate.value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 18) {
                    birthDateError.textContent = 'Вам має бути щонайменше 18 років.';
                    inputBirthDate.style.borderColor = 'red';
                    isValidForm = false;
                } else {
                    birthDateError.textContent = '';
                    inputBirthDate.style.borderColor = '#ddd';
                }
            }

            if (!inputTerms.checked) {
                termsError.textContent = 'Ви повинні погодитися з умовами.';
                isValidForm = false;
            } else {
                termsError.textContent = '';
                
            }

            if (isValidForm) {
                alert('Форма успішно валідована та (нібито) відправлена!');
                formaRegistracii.reset();
                const inputs = formaRegistracii.querySelectorAll('input');
                inputs.forEach(input => input.style.borderColor = '#ddd');
                const errors = formaRegistracii.querySelectorAll('.error_text');
                errors.forEach(error => error.textContent = '');
            }
        });
    }
}); 