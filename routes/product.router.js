const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/product.controller');

router.get('/products', categoryController.getAllProducts);
router.get('/product/:id', categoryController.getProductById);
router.post('/product', categoryController.createProduct);
router.put('/product/:id', categoryController.updateProduct);
router.delete('/product/:id', categoryController.deleteProduct);


module.exports = router;
