const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/review.controller')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/reviews', reviewController.getAllReviews);
router.get('/reviews/:productId', reviewController.getReviewsByProduct);
router.get('/review/:id', reviewController.getReviewById);
router.put('/review/:id', reviewController.updateReview);
router.delete('/review/:id', checkRole('admin'), reviewController.deleteReview);


module.exports = router;
