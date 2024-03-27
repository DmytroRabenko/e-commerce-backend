const Router = require('express');
const router = new Router();
const orderController = require('../controllers/order.controller');
const checkRole = require('../middleware/checkRoleMiddleware');

// Отримати всі замовлення користувача
router.get('/user/:id/orders', orderController.getUserOrders);
// Отримати інформацію про конкретне замовлення
router.get('/order/:id', orderController.getOrderById);
// Створити нове замовлення (доступ тільки для авторизованих користувачів)
router.post('/order', orderController.createOrder);
// Видалити замовлення (доступ тільки для адміністраторів)
router.delete('/order/:id', checkRole('admin'), orderController.deleteOrder);

module.exports = router;
