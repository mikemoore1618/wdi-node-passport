const
  express = require('express'),
  usersRouter = new express.Router(),
  passport = require('passport')

// render login view
usersRouter.get('/login', (req, res) => {
  res.render('login')
})

usersRouter.post('/login', passport.authenticate('local-login', {
  successRedirect: '/users/profile', 
  failureRedirect: '/users/login'
}))
// render signup view
usersRouter.get('/signup', (req, res) => {
  res.render('signup')
})

usersRouter.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/users/profile', 
  failureRedirect: '/users/signup'
}))

usersRouter.get('/profile', isLoggedIn, (req, res) => {
  //isLoggedIn is middle ware before completing get request
  res.render('profile', { user: req.user })
})

usersRouter.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/users/login')
}

module.exports = usersRouter