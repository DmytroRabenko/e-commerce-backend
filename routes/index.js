//  об'єднуємо всі роути в одному файлі
const Router = require('express')
const router = new Router()
const categoryRouter = require('./category.router')


router.use('/category', categoryRouter)

module.exports = router
