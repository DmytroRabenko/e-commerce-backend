// categoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCategoryById(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      // Перевірка на обов'язкові поля
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      const newCategory = await prisma.category.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
            // Перевірка на обов'язкові поля
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      const updatedCategory = await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
          description,
        },
      });
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new CategoryController();
