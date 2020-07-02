// Requiring modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user');
const methodOverride = require('method-override')

const app = express();

// Requiring routes 
const productRoutes = require('./routes/product');
const commentRoutes = require('./routes/comment');



// App Config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));

app.locals.moment = require('moment');

// Connect mongoose to DB
mongoose.connect("mongodb://localhost/eShop", {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true 
});

// Make sure mongoose connected successfully to DB
let db = mongoose.connection;
db.on("err", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Successfully connected to DB 💾"));

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use(productRoutes);
app.use(commentRoutes)


// listening to the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port port 🔥`));
