const Router = require('express');
const router = new Router();
const mainCategoryController = require('../controllers/main-category.controller ');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/main-categories', mainCategoryController.getAllCategories);
router.get('/main-category/:id', mainCategoryController.getMainCategoryById);
router.post('/main-category', checkRole('admin'), mainCategoryController.createMainCategory);
router.put('/main-category/:id', checkRole('admin'), mainCategoryController.updateMainCategory);
router.delete('/main-category/:id', checkRole('admin'), mainCategoryController.deleteMainCategory);

module.exports = router;
