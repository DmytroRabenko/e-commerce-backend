const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/category.controller');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/categories', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/category', checkRole('admin'), categoryController.createCategory);
router.put('/category/:id', checkRole('admin'), categoryController.updateCategory);
router.delete('/category/:id', checkRole('admin'), categoryController.deleteCategory);

module.exports = router;
