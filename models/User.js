const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  })

//allow a user to generate a hashed password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password)
}

//authenticate: return boolean if correct password or not
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

//middleware for mongoose: "before you save"
userSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    this.password = this.generateHash(this.password)
  }
  next() //go ahead and proceed with the save
})

/*
var newUser = new User()
  newUser.password = newUser.generatehash(req.body.password)

newUser.save()
*/

const User = mongoose.model('User', userSchema)
module.exports = User