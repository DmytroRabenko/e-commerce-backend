const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');//валідація токена

router.post('/user/registration', userController.registration);
router.post('/user/login', userController.login);
router.get('/user/auth', authMiddleware, userController.check);

module.exports = router;
