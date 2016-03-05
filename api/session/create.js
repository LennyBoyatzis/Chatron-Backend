'use strict'

const jwt = require('jwt-simple')

// In a real world app, this would be set in .env file
const JWT_TOKEN_SECRET = 'chatron-chat-app'

module.exports = (req, res) => {
  res.status(200).json({ user: "leny" })
}
