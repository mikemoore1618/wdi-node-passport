const
	express = require('express'),
	app = express(),
	ejsLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	passport = require('passport'),
	passportConfig = require('./config/passport.js')
	usersRouter = require('./routes/users.js')

// environment port
const
	port = process.env.PORT || 3000,
	mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/passport-authentication'

// mongoose connection
mongoose.connect(mongoConnectionString, (err) => {
	console.log(err || "Connected to MongoDB (passport-authentication)")
})

// will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
});

// middleware
app.use(logger('dev')) // log incoming requests to terminal
app.use(cookieParser()) // interpret cookies that are attached to requests
app.use(express.urlencoded({extended: true})) // interpret standard form data in requests
app.use(flash()) // set and reset flash messages

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.use(session({
	secret: "You are God",
	cookie: { maxAge: 60000000 },
	resave: true,
	saveUninitialized: false,
	store: store
}))

app.use(passport.initialize())
app.use(passport.session())

//make current user available in every view
app.use((req, res, next) => {
	app.locals.currentUser = req.user
	app.locals.loggedIn = !!req.user
	next()
})

//root route
app.get('/', (req,res) => {
	res.render('index')
})

app.use('/users', usersRouter)

app.listen(port, (err) => {
	console.log(err || "Server running on port " + port)
})
