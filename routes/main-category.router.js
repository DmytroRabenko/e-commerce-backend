const Router = require('express');
const router = new Router();
const mainCategoryController = require('../controllers/main-category.controller ');

router.get('/main-categories', mainCategoryController.getAllCategories);
router.get('/main-category/:id', mainCategoryController.getMainCategoryById);
router.post('/main-category', mainCategoryController.createMainCategory);
router.put('/main-category/:id', mainCategoryController.updateMainCategory);
router.delete('/main-category/:id', mainCategoryController.deleteMainCategory);

module.exports = router;
