/*
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
*/
const express = require("express");
require("dotenv").config();
//роути
const categoryRouter = require('./routes/category.router')


const port = process.env.PORT || 3001;


const app = express();


app.use(express.json());
app.use('/api', categoryRouter)



app.get("/", (req, res) => {
  res.send("сервер працює за азпитом /");
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
