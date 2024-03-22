const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3001;
//роути
const productRouter = require('./routes/product.router');
const categoryRouter = require('./routes/category.router');
const mainCategoryRouter = require('./routes/main-category.router');

const app = express();

app.use(cors());
app.use(express.json());
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
