// Requiring modules
require('dotenv').config()
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

// Passport Configuration 
app.use(require('express-session')({
  secret: process.env.USER_PASS, 
  resave: false, 
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Make req.user available to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

// Routes
app.use(productRoutes);
app.use(commentRoutes)


// Auth routes
// Register route
app.get("/register", (req, res) => {
  res.render('register')
});

app.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err) 
      return res.render('register')
    }
    passport.authenticate('local')(req, res, () => [
      res.redirect('/products')
    ])
  })
});

// Login route
app.get("/login", (req, res) => {
  res.render('login')
});

app.post("/login", passport.authenticate('local', 
  {
    successRedirect: '/products', 
    failureRedirect: '/login'
}), (req, res) => {  
});

// Logout Route 
app.get("/logout", (req, res) => {
  req.logout()
  res.redirect('/products')
});

// listening to the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port port 🔥`));
