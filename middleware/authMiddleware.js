//для перевірки токена на валідність
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk тип токена потім токен
        if (!token) {
            return res.status(401).json({message: "unauthorized"})
        }
        //перевірка токена на валідність (токен, секретний ключ)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: "unauthorized"})
    }
};
