// categoryController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class CartController {
  // Отримання всіх продуктів у корзині користувача
  getCartItemsByUserId = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      // Отримання всіх продуктів у корзині для даного користувача
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error getting cart items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // Додавання продукту до корзини користувача
  addToCart = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      // Перевірка, чи існує вже запис у корзині для даного користувача та продукту
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      });

      if (existingCartItem) {
        return res.status(400).json({ error: 'This product already exists in the cart' });
      }

      // Додавання продукту до корзини
      const cartItem = await prisma.cartItem.create({
        data: {
          user: { connect: { id: parseInt(userId) } },
          product: { connect: { id: parseInt(productId) } },
          quantity: parseInt(quantity),
        },
      });

      res.status(201).json({ success: true, cartItem });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Оновлення кількості продукту у корзині користувача
  updateCartItemQuantity = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      // Оновлення кількості продукту у корзині
      await prisma.cartItem.updateMany({
        where: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
        data: {
          quantity: parseInt(quantity),
        },
      });

      res.status(200).json({ success: true, message: 'Cart item quantity updated successfully' });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Видалення продукту з корзини користувача
  removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
      // Видалення продукту з корзини
      await prisma.cartItem.deleteMany({
        where: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      });

      res.status(200).json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

module.exports = new CartController();
