const Router = require('express');
const router = new Router();
const wishlistController = require('../controllers/wishlist.controller')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/user/:id/wishlist', wishlistController.getWishlistItemsByUserId);
router.post('/wishlist', wishlistController.addToWishlist);
router.delete('/wishlist/:id', checkRole('admin'), wishlistController.removeFromWishlist);

module.exports = router;
