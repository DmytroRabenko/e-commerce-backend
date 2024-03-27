const jwt = require('jsonwebtoken');

// Експорт middleware функції, яка перевіряє доступ користувача за роллю
module.exports = function(role) {
    return function (req, res, next) {
        // Перевірка, чи метод запиту OPTIONS, якщо так, переходимо до наступного middleware
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            // Отримання токена з заголовка Authorization та його розшифрування
            const token = req.headers.authorization.split(' ')[1]; // Bearer asfasnfkajsfnjk
            
            // Перевірка, чи токен існує
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" });
            }
            
            // Розшифрування та перевірка токена
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Перевірка, чи роль користувача співпадає з необхідною роллю
            if (decoded.role !== role) {
                return res.status(403).json({ message: "no access" });
            }
            
            // Додавання розшифрованих даних користувача до об'єкту запиту
            req.user = decoded;
            
            // Перехід до наступного middleware
            next();
        } catch (e) {
            // Обробка помилки, якщо токен недійсний або відсутній
            res.status(401).json({ message: "unauthorized" });
        }
    };
};
