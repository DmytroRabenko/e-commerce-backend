// categoryController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class WishListController {
  // Отримання всіх продуктів у списку бажань користувача
  getWishlistItemsByUserId = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Отримання всіх продуктів у списку бажань для даного користувача
      const wishlistItems = await prisma.wishlist.findMany({
        where: { userId },
        include: { product: true },
      });

      res.status(200).json(wishlistItems);
    } catch (error) {
      console.error('Error getting wishlist items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  addToWishlist = async (req, res) => {
    try {
      const { userId, productId } = req.body;

      // Перевірка, чи існує вже запис у списку бажань для даного користувача та продукту
      const existingWishlistItem = await prisma.wishlist.findFirst({
        where: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      });

      if (existingWishlistItem) {
        return res.status(400).json({ error: 'This product already exists in the wishlist' });
      }

      // Додавання продукту до списку бажань
      const wishlistItem = await prisma.wishlist.create({
        data: {
          user: { connect: { id: parseInt(userId) } },
          product: { connect: { id: parseInt(productId) } },
        },
      });

      res.status(201).json({ success: true, wishlistItem });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Видалення продукту зі списку бажань користувача
  removeFromWishlist = async (req, res) => {
    try {
      const { userId, productId } = req.body;

      // Видалення продукту зі списку бажань
      await prisma.wishlist.deleteMany({
        where: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      });

      res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

module.exports = new WishListController();
