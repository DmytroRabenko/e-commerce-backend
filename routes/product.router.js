const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/product.controller');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/products', categoryController.getAllProducts);
router.get('/product/:id', categoryController.getProductById);
router.post('/product', checkRole('admin'), categoryController.createProduct);
router.put('/product/:id', checkRole('admin'), categoryController.updateProduct);
router.delete('/product/:id', checkRole('admin'), categoryController.deleteProduct);


module.exports = router;
