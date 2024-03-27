// categoryController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class BrandController {

  //отримати всі категорії
  async getAllBrands(req, res) {
    try {
      const brands = await prisma.brand.findMany();
      res.json(brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

 //отримати категорію по id
  async getBrandById(req, res) {
    try {
      const brandId = parseInt(req.params.id);
      const brand = await prisma.brand.findUnique({
        where: {
          id: brandId,
        },
      });
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  //створити категорію
  async createBrand(req, res) {
    try {
      const { name } = req.body;
      // Перевірка на обов'язкові поля
      if (!name ) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const newBrand = await prisma.brand.create({
        data: {
          name,
        },
      });
      res.status(201).json(newBrand);
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  //оновити категорію
  async updateBrand(req, res) {
    try {
      const brandId = parseInt(req.params.id);
            // Перевірка на обов'язкові поля
      const { name} = req.body;
      if (!name ) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const updatedBrand = await prisma.brand.update({
        where: {
          id: brandId,
        },
        data: {
          name
        },
      });
      res.json(updatedBrand);
    } catch (error) {
      console.error('Error updating brand:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  //видалити категорію
  async deleteBrand(req, res) {
    try {
      const brandId = parseInt(req.params.id);
      await prisma.brand.delete({
        where: {
          id: brandId,
        },
      });
      res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new BrandController();
