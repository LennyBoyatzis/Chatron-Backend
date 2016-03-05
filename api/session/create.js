'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const mongoose = require('mongoose')
const async = require('async')
const UserSchema = require('../models/User')
const User = mongoose.model('User', UserSchema)

// In a real world app, this would be set in .env file
const JWT_TOKEN_SECRET = 'chatron-chat-app'
const tokenExpiry = moment().add(7, 'days').valueOf();

module.exports = (req, res) => {
  User
    .findOne({ username: req.body.username })
    .exec((err, user) => {
      if (err) return res.status(500).json(err)
      if (!user) return res.status(404).json({ err: 'Invalid user' })

      if ( user.password === req.body.password ) {
        const token = jwt.encode({
          iss: req.body.username,
          exp: tokenExpiry
        }, JWT_TOKEN_SECRET)

        return res.json({
          user: user,
          token: token,
          expires: tokenExpiry
        })
      }
    })
}
