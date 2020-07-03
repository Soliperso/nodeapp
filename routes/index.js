const express = require("express");
const router = express.Router();
const passport = require('passport')


// Register route
router.get("/register", (req, res) => {
  res.render('register')
});

router.post("/register", (req, res) => {
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
router.get("/login", (req, res) => {
  res.render('login')
});

router.post("/login", passport.authenticate('local', 
  {
    successRedirect: '/products', 
    failureRedirect: '/login'
}), (req, res) => {  
});

// Logout Route 
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect('/products')
});

module.exports = router;