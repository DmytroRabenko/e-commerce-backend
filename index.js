const express = require("express")
const cors = require('cors')
require("dotenv").config()
//роути
const categoryRouter = require('./routes/category.router')

const port = process.env.PORT || 3001;


const app = express();


app.use(cors())
app.use(express.json());
app.use('/api', categoryRouter)


app.get("/", (req, res) => {
  res.send("сервер працює за запитом /");
});
app.get("/about", (req, res) => {
  res.send("сервер працює за запитом /about");
});
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
