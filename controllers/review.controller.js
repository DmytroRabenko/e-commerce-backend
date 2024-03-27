const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
ReviewController;
class ReviewController {
  // Отримання всіх відгуків для всіх продуктів
  getAllReviews = async (req, res) => {
    try {
      const { page = 1, perPage = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(perPage);
      const reviews = await prisma.review.findMany({
        take: parseInt(perPage),
        skip: offset,
      });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };
  // Отримання всіх відгуків для певного продукту з пагінацією
  getReviewsByProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const { page = 1, perPage = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(perPage);
      const reviews = await prisma.review.findMany({
        where: {
          productId: parseInt(productId),
        },
        take: parseInt(perPage),
        skip: offset,
      });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };
  // Створення відгуку
  createReview = async (req, res) => {
    try {
      // Перевірка, чи користувач зареєстрований
      let user;
      if (req.user) {
        user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
        });
      }

      // Якщо користувач зареєстрований, використовуємо його дані
      if (user) {
        const review = await prisma.review.create({
          data: {
            content: req.body.content,
            rating: req.body.rating,
            productId: req.body.productId,
            userId: req.user.id,
          },
        });
        res.status(201).json(review);
      } else {
        // Якщо користувач не зареєстрований, потрібно перевірити наявність відгуку за вказаним email
        const existingReview = await prisma.review.findFirst({
          where: {
            email: req.body.email,
            productId: req.body.productId,
          },
        });
        if (existingReview) {
          return res.status(400).json({ error: 'Відгук вже був залишений з цим email для цього продукту' });
        }
        const review = await prisma.review.create({
          data: {
            content: req.body.content,
            email: req.body.email,
            rating: req.body.rating,
            productId: req.body.productId,
          },
        });
        res.status(201).json(review);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };
  // Оновлення відгуку за id
  updateReview = async (req, res) => {
    try {
      const { id } = req.params;
      const review = await prisma.review.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };
  // Видалення відгуку за id
  deleteReview = async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.review.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: 'Відгук успішно видалено' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  };
}
// Інші маршрути, такі як отримання відгуків, видалення, тощо, можна додати подібним чином

module.exports = new ReviewController();
