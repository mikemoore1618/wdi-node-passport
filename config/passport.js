const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User.js')

//used to create cookies
passport.serializeUser((user, done) => {
    done(null, user._id)
})

//used to figure out who made the request
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err)
        if(user) return done(null, false, req.flash('signupMessage', 'That email is already taken'))
        User.create(req.body, (err, newUser) => {
            if (err) return done(err)
            return done(null, newUser)
        })
    })
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    //check to see if email enter is valid user
    User.findOne({ email: email }, (err, user) => {
        if(err) return done(err)
        // if yes: check to see if password is correct
        if(!user || !user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Login Failed'))
        return done(null, user, req.flash('loginSuccessMessage', `Hi  ${user.name}`))
    })
}))

module.exports = passport