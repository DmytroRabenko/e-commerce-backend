const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//функція для хеширування токену
const generateJwt = (id, username, email, role) => {
  return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class UserController {
  // Контролер для реєстрації нового користувача
  registration = async (req, res) => {
    const { username, email, password, role} = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Всі дані мають бути заповнені' });
    }

    try {
      // Перевірка чи існує вже користувач з таким email
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Користувач з такою електронною поштою вже існує' });
      }
      // Хешування паролю
      const hashedPassword = await bcrypt.hash(password, 5);

      // Створення нового користувача
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          role,
          password: hashedPassword,
        },
      });

      // Генеруємо JWT-токен для нового користувача
      const token = generateJwt(newUser.id, newUser.username, newUser.email, newUser.role);

      res.json({ token });
    } catch (error) {
      console.error('Помилка при реєстрації користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };

  // Контролер для входу користувача
  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Пошук користувача за email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Невірні дані для входу' });
      }

      // Перевірка правильності паролю
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Невірні дані для входу' });
      }

      // Генеруємо JWT-токен для нового користувача
      const token = generateJwt(user.id, user.username, user.email, user.role);

      res.json({ token });
    } catch (error) {
      console.error('Помилка при вході користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };

  // Перевірка токена користувача
  check = async (req, res, next) => {
    const token = generateJwt(req.user.id, user.username, req.user.email, req.user.role);
    return res.json({ token });
  };
  /*
  check = async (req, res, next) => {
    // Отримання токена з заголовків запиту
    const token = req.header('Authorization');

    // Перевірка чи токен існує
    if (!token) {
      return res.status(401).json({ message: 'Відмовлено в доступі, немає токена' });
    }

    try {
      // Перевірка токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Додавання інформації про користувача до об'єкта запиту
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Помилка перевірки токена:', error);
      res.status(401).json({ message: 'Токен недійсний' });
    }
  };
  */
}

module.exports = new UserController();
