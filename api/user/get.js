const mongoose = require('mongoose')
const UserSchema = require('../../models/User')
const User = mongoose.model('User', UserSchema)

module.exports = (req, res) => {
  console.log("Should be here?")
  User
    .find()
    .where('currentlyOnline', true)
    .exec((err, users) => {
      if (err) return res.status(500).json(err)
      if (!users) return res.status(404).json({ err: 'No users available' })

      console.log("Here are all the users currently online ---->", users)
      return res.status(200).json(users)
    })
}