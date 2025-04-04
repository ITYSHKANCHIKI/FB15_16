const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

// Настройка CORS, чтобы фронт мог обращаться к бэку
app.use(cors({ origin: 'http://127.0.0.1:5502', credentials: true }));

// Мидлвары
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем папку с фронтом (где index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Конфигурация сессии
app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 86400000 } // 24 часа
}));

// Если кто-то зайдёт на главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для логина
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '12345') {
        req.session.user = { username };
        return res.json({ success: true });
    }
    res.status(401).json({ success: false });
});

// Проверка авторизации
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        return res.json({ authenticated: true, user: req.session.user });
    }
    res.json({ authenticated: false });
});

// Выход из системы
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Ошибка выхода');
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
