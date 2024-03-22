// для категорій типу sale,
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MainCategoryController {

  // отримати всі категорії
  async getAllCategories(req, res) {
    try {
      const categories = await prisma.mainCategory.findMany();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getMainCategoryById(req, res) {
    try {
      const mainCategoryId = parseInt(req.params.id);
      const mainCategory = await prisma.mainCategory.findUnique({
        where: {
          id: mainCategoryId,
        },
      });
      if (!mainCategory) {
        return res.status(404).json({ error: 'Main Category not found' });
      }
      res.json(mainCategory);
    } catch (error) {
      console.error('Error fetching Main category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // створити категорію
  async createMainCategory(req, res) {
    try {
      const { name, value } = req.body;
      // Перевірка на обов'язкові поля
      if (!name && !value) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      const newMainCategory = await prisma.mainCategory.create({
        data: {
          name,
          value,
        },
      });
      res.status(201).json(newMainCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  //оновити категорію
  async updateMainCategory(req, res) {
    try {
      const mainCategoryId = parseInt(req.params.id);
      // Перевірка на обов'язкові поля
      const { name, value } = req.body;
      if (!name || !value) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      const updatedMainCategory = await prisma.mainCategory.update({
        where: {
          id: mainCategoryId,
        },
        data: {
          name,
          value,
        },
      });
      res.json(updatedMainCategory);
    } catch (error) {
      console.error('Error updating main category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  //видалити категорію
  async deleteMainCategory(req, res) {
    try {
      const mainCategoryId = parseInt(req.params.id);
      await prisma.mainCategory.delete({
        where: {
          id: mainCategoryId,
        },
      });
      res.json({ message: 'Main category deleted successfully' });
    } catch (error) {
      console.error('Error deleting main category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new MainCategoryController();
