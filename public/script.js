document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');

    checkAuth();

    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                checkAuth();
            } else {
                showError('Неверные учетные данные');
            }
        } catch (err) {
            showError('Ошибка соединения');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                authSection.classList.remove('hidden');
                profileSection.classList.add('hidden');
            }
        } catch (err) {
            showError('Ошибка при выходе');
        }
    });

    async function checkAuth() {
        try {
            const response = await fetch('http://localhost:4000/check-auth', {
                credentials: 'include'
            });

            const data = await response.json();
            if (data.authenticated) {
                document.getElementById('username-display').textContent = data.user.username;
                authSection.classList.add('hidden');
                profileSection.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Ошибка проверки авторизации:', err);
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 3000);
    }
});
