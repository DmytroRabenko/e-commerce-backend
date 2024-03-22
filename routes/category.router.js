const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/category.controller');

router.get('/categories', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/category', categoryController.createCategory);
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router;
