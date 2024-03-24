const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const path = require('path')
const port = process.env.PORT || 3001;
//експорт роутів
const productRouter = require('./routes/product.router');
const categoryRouter = require('./routes/category.router');
const mainCategoryRouter = require('./routes/main-category.router');

//ініціалізація express
const app = express();
//можливість отримувати запити від браузера
app.use(cors());
//можливість читати формат json
app.use(express.json());
//можливість читати папку static
app.use(express.static(path.resolve(__dirname, 'static')));
//можливість завантажувати файли
app.use(fileUpload({}));
//робота з роутами
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', mainCategoryRouter);

app.get('/', (req, res) => {
  res.send('сервер працює за запитом /');
});
app.get('/about', (req, res) => {
  res.send('сервер працює за запитом /about');
});
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
