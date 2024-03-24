// categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const uuid = require('uuid');

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const { title, description, brand, seria, price, count, value, gender, categoryId, mainCategoryId, attributes } =
        req.body;
      const newPrice = parseFloat(price);
      const newCount = parseFloat(count);
      const newCategoryId = parseFloat(categoryId);
      const newMainCategoryId = parseFloat(mainCategoryId);

      // Отримання масиву з фотографіями
      const mediaFiles = req.files['media'];

      // Створення масиву для зберігання імен файлів
      let fileNames = [];

      // Переміщення кожного файлу в папку static та збереження імен у масив
      for (const media of mediaFiles) {
        let fileName = uuid.v4() + '.jpg';
        media.mv(path.resolve(__dirname, '..', 'static', fileName));
        fileNames.push(fileName);
      }

      // Створення нового продукту з відповідними даними та фотографіями
      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          brand,
          seria,
          gender,
          price: newPrice,
          count: newCount,
          value,
          media: fileNames, // Додаємо масив імен файлів до поля media
          categoryId: newCategoryId,
          mainCategoryId: newMainCategoryId,
        },
      });

      res.status(201).json({ success: true, message: 'Продукт успішно створений', product: newProduct });
    } catch (error) {
      console.error('Помилка при створенні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при створенні продукту' });
    }
  };
 
  //отримати всі продукти
  async getAllProducts(req, res) {
    try {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  //отримати продукт по id
  // Контролер для отримання продукту за його id
  getProductById = async (req, res) => {
    const productId = parseInt(req.params.id); // Отримання id продукту з параметрів маршруту

    try {
      // Отримання продукту за його id з бази даних
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        // Включення пов'язаних даних: атрибути, категорія, основна категорія, відгуки тощо
        include: {
          attributes: true,
          category: true,
          mainCategory: true,
          reviews: true,
        },
      });

      // Перевірка, чи знайдено продукт за вказаним id
      if (!product) {
        return res.status(404).json({ success: false, message: 'Продукт не знайдено' });
      }

      // Повернення знайденого продукту як відповідь на запит
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error('Помилка при отриманні продукту за id:', error);
      res.status(500).json({ success: false, message: 'Помилка при отриманні продукту за id' });
    }
  };

  //створити продукт
 
  //оновити продукт
  updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, description, brand, seria, price, count, categoryId, mainCategoryId, attributes } = req.body;

    try {
      // Перевірка чи існує продукт з вказаним id
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Продукт не знайдено' });
      }

      // Оновлення існуючого продукту
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          title,
          description,
          brand,
          seria,
          price,
          count,
          categoryId,
          mainCategoryId,
          attributes: {
            deleteMany: {}, // Видаляє всі попередні атрибути продукту
            createMany: {
              data: attributes.map(attribute => ({
                attributeKey: attribute.key,
                attributeValue: attribute.value,
              })),
            },
          },
        },
      });

      res.status(200).json({ success: true, message: 'Продукт успішно оновлено', product: updatedProduct });
    } catch (error) {
      console.error('Помилка при оновленні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при оновленні продукту' });
    }
  };
  //видалити продукт
  deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id); // Отримання id продукту з параметрів маршруту

    try {
      // Пошук продукту за id
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      // Перевірка, чи знайдено продукт
      if (!product) {
        return res.status(404).json({ success: false, message: 'Продукт не знайдено' });
      }

      // Видалення продукту з бази даних
      await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      res.status(200).json({ success: true, message: 'Продукт успішно видалено' });
    } catch (error) {
      console.error('Помилка при видаленні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при видаленні продукту' });
    }
  };
}

module.exports = new ProductController();
