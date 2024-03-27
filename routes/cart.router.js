const Router = require('express');
const router = new Router();
const cartController = require('../controllers/cart.controller')

router.get('/cart/:id', cartController.getCartItemsByUserId);
router.post('/cart', cartController.addToCart);
router.put('/cart', cartController.updateCartItemQuantity);
router.delete('/cart', cartController.removeFromCart);

module.exports = router;
