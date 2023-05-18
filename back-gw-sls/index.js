const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require("mongoose")
require("dotenv").config();
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Gimwork backend is working",
  });
});

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

/* const productSchema = mongoose.Schema({
  name: String
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, async(req, res) => {
  const productList = await Product.find()
  res.send(productList)
})

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
  })

  product.save().then(( createProduct => {
    res.status(201).json(createProduct)
  })).catch( err => {
    res.status(5000).json(err)
  })
}) */

//
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Gimwork-db",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});

module.exports.handler = serverless(app);
