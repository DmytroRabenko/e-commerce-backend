// categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const saveFiles = require('../middleware/saveFiles');
const deleteFiles = require('../middleware/deleteFiles');

class ProductController {
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
  //Створити продукт
  createProduct = async (req, res, next) => {
    try {
      let {
        title,
        description,
        brand,
        seria,
        price,
        sale,
        count,
        value,
        gender,
        categoryId,
        mainCategoryId,
        attributes,
      } = req.body;
      const newPrice = parseFloat(price);
      const newSale = parseFloat(sale);
      const newCount = parseFloat(count);
      const newCategoryId = parseFloat(categoryId);
      const newMainCategoryId = parseFloat(mainCategoryId);

      // Перевірка наявності файлів та їх збереження
      const fileNames = req.files?.['media'] ? await saveFiles(req.files['media']) : [];

      // Створення нового продукту з відповідними даними та фотографіями
      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          brand,
          seria,
          gender,
          price: newPrice,
          sale: newSale,
          count: newCount,
          value,
          media: fileNames, // Додаємо масив імен файлів до поля media
          categoryId: newCategoryId,
          mainCategoryId: newMainCategoryId,
        },
      });

      if (attributes) {
        const attributesData = JSON.parse(attributes);
        attributesData.forEach(
          async attribute =>
            await prisma.productAttribute.create({
              data: {
                product: { connect: { id: newProduct.id } }, // Встановлення зв'язку з продуктом
                attributeKey: attribute.key,
                attributeValue: attribute.value,
              },
            })
        );
      }

      res.status(201).json({ success: true, message: 'Продукт успішно створений', product: newProduct });
    } catch (error) {
      console.error('Помилка при створенні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при створенні продукту' });
    }
  };
  //Оновити продукт
  updateProduct = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id); // Отримуємо ідентифікатор продукту з параметрів запиту
      // Отримуємо дані для оновлення з тіла запиту
      let {
        title,
        description,
        brand,
        seria,
        price,
        sale,
        count,
        value,
        gender,
        categoryId,
        mainCategoryId,
        attributes,
      } = req.body;
      const newPrice = parseFloat(price);
      const newSale = parseFloat(sale);
      const newCount = parseFloat(count);
      const newCategoryId = parseFloat(categoryId);
      const newMainCategoryId = parseFloat(mainCategoryId);
      // Перевірка наявності файлів та їх збереження
      const fileNames = req.files?.['media'] ? await saveFiles(req.files['media']) : [];

      // Отримання існуючого продукту за його ідентифікатором
      const existingProduct = await prisma.product.findUnique({
        where: {
          id: productId,
          // include: { attributes: true },
        },
      });

      // Видалення попередніх файлів продукту
      if (existingProduct && existingProduct.media && existingProduct.media.length > 0) {
        await deleteFiles(existingProduct.media);
      }

      // Оновлення продукту з відповідними даними та новими фотографіями
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          title,
          description,
          brand,
          seria,
          gender,
          price: newPrice,
          sale: newSale,
          count: newCount,
          value,
          media: fileNames, // Додаємо масив імен файлів до поля media
          categoryId: newCategoryId,
          mainCategoryId: newMainCategoryId,
        },
      });
      await prisma.productAttribute.deleteMany({
        where: { productId: productId },
      });
      // Оновлення атрибутів продукту (якщо вони були передані)
      if (attributes) {
        const attributesData = JSON.parse(attributes);
        attributesData.forEach(
          async attribute =>
            await prisma.productAttribute.create({
              data: {
                product: { connect: { id: productId } }, // Встановлення зв'язку з продуктом
                attributeKey: attribute.key,
                attributeValue: attribute.value,
              },
            })
        );
      }

      // Відповідь з успішним оновленням продукту
      res.status(200).json({ success: true, message: 'Продукт успішно оновлено', product: updatedProduct });
    } catch (error) {
      console.error('Помилка при оновленні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при оновленні продукту' });
    }
  };
  //видалити продукт
  deleteProduct = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      // Перевірка чи існує продукт з вказаним productId
      const existingProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Продукт з вказаним ID не знайдено' });
      }
      // Видалення атрибутів продукту
      await prisma.productAttribute.deleteMany({
        where: {
          productId: productId,
        },
      });
      // Видалення самого продукту
      await prisma.product.delete({
        where: {
          id: productId,
        },
      });
      res.status(200).json({ success: true, message: 'Продукт та його атрибути успішно видалені' });
    } catch (error) {
      console.error('Помилка при видаленні продукту:', error);
      res.status(500).json({ success: false, message: 'Помилка при видаленні продукту' });
    }
  };
}

module.exports = new ProductController();
