const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brand.controller')
const checkRole = require('../middleware/checkRoleMiddleware')
//checkRole('admin') доступ до функцій тільки адміністраторам
router.get('/brands', brandController.getAllBrands);
router.get('/brand/:id', brandController.getBrandById);
router.post('/brand', checkRole('admin'), brandController.createBrand);//
router.put('/brand/:id', checkRole('admin'), brandController.updateBrand);
router.delete('/brand/:id', checkRole('admin'), brandController.deleteBrand);

module.exports = router;
