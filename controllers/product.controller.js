// categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const saveFiles = require('../middleware/saveFiles');
const deleteFiles = require('../middleware/deleteFiles');

class ProductController {
  //отримати всі продукти
  /*
  async getAllProducts(req, res) {
    try {
      // Отримання параметрів запиту, таких як сторінка, розмір сторінки та фільтри
      const {
        page = 1,
        pageSize = 10,
        brand,
        category,
        cat,
        rating,
        priceGreaterThan,
        priceLessThan,
        sort,
      } = req.query;

      // Створення об'єкту для фільтрів
      let filters = {};

      // Додавання фільтрів до об'єкту з фільтрами
      if (brand) {
        // brand=Lanvin&brand=Lanvin2
        if (Array.isArray(brand)) {
          filters.brand = { in: brand };
        } else {
          filters.brand = brand;
        }
      }
      if (category) filters.categoryId = parseInt(category); // &category=2
      if (cat) filters.mainCategoryId = parseInt(cat); // &cat=2
      if (rating) filters.rating = parseInt(rating); // &rating=2

      // Додавання фільтрів за ціною
      if (priceGreaterThan) filters.price = { gte: parseFloat(priceGreaterThan) };
      if (priceLessThan) {
        //?price-more=200&priceLessThan=500
        if (!filters.price) filters.price = {};
        filters.price.lte = parseFloat(priceLessThan);
      }
      //сортування
      let orderBy = {};
      if (sort === 'price') orderBy.price = 'asc'; //&sort=price
      if (sort === '-price') orderBy.price = 'desc'; //&sort=-price
      if (sort === 'rating') orderBy.rating = 'asc';
      if (sort === '-rating') orderBy.rating = 'desc';
      if (sort === 'createdAt') orderBy.createdAt = 'asc';
      if (sort === '-createdAt') orderBy.createdAt = 'desc';

      // Підрахунок загальної кількості продуктів з урахуванням фільтрів
      const totalCount = await prisma.product.count({ where: filters });

      // Обчислення загальної кількості сторінок та визначення відступу для поточної сторінки
      const totalPages = Math.ceil(totalCount / pageSize);
      const offset = (page - 1) * pageSize;

      // Отримання продуктів для поточної сторінки з урахуванням фільтрів та пагінації
      const products = await prisma.product.findMany({
        where: filters,
        orderBy,
        skip: offset,
        take: parseInt(pageSize),
      });

      // Відправлення відповіді з даними про продукти, загальною кількістю сторінок та поточною сторінкою
      res.status(200).json({
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalCount,
        products,
      });
    } catch (error) {
      // Обробка помилок
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
*/
async getAllProducts(req, res) {
  try {
    // Отримання параметрів запиту
    const {
      page = 1,
      pageSize = 10,
      brands,
      category,
      mainCategory,
      rating,
      priceGreaterThan,
      priceLessThan,
      sort,
    } = req.query;

    // Формування фільтрів
    const filters = {};
    if (brands) filters.brandId = parseInt(brands);
    if (category) filters.categoryId = parseInt(category);
    if (mainCategory) filters.mainCategoryId = parseInt(mainCategory);
    if (rating) filters.rating = parseInt(rating);
    if (priceGreaterThan) filters.price = { gte: parseFloat(priceGreaterThan) };
    if (priceLessThan) {
      if (!filters.price) filters.price = {};
      filters.price.lte = parseFloat(priceLessThan);
    }

    // Формування сортування
    const orderBy = {};
    switch (sort) {
      case 'price':
        orderBy.price = 'asc';
        break;
      case '-price':
        orderBy.price = 'desc';
        break;
      case 'rating':
        orderBy.rating = 'asc';
        break;
      case '-rating':
        orderBy.rating = 'desc';
        break;
      case 'createdAt':
        orderBy.createdAt = 'asc';
        break;
      case '-createdAt':
        orderBy.createdAt = 'desc';
        break;
      default:
        break;
    }

    // Підрахунок загальної кількості продуктів з урахуванням фільтрів
    const totalCount = await prisma.product.count({ where: filters });

    // Отримання продуктів для поточної сторінки з урахуванням фільтрів та пагінації
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const products = await prisma.product.findMany({
      where: filters,
      orderBy,
      skip: offset,
      take: parseInt(pageSize),
    });

    // Відправлення відповіді
    res.status(200).json({
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalCount,
      products,
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

  //отримати продукт по id
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
        seria,
        price,
        sale,
        count,
        value,
        gender,
        brandId,
        categoryId,
        mainCategoryId,
        attributes,
      } = req.body;
      const newPrice = parseFloat(price);
      const newSale = parseFloat(sale);
      const newCount = parseInt(count);
      const newBrandId = parseInt(brandId);
      const newCategoryId = parseInt(categoryId);
      const newMainCategoryId = parseInt(mainCategoryId);

      // Перевірка наявності файлів та їх збереження
      const fileNames = req.files?.['media'] ? await saveFiles(req.files['media']) : [];

      // Створення нового продукту з відповідними даними та фотографіями
      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          seria,
          gender,
          price: newPrice,
          sale: newSale,
          count: newCount,
          value,
          brandId: newBrandId,
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
