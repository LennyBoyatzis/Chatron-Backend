'use strict'

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const randomkey = require('randomkey')
const bodyParser = require('body-parser')
const PORT = 3001
const generatePregistrationId = require('./lib/utils')
const mongoose = require('mongoose')
const UserSchema = require('./models/User')
const User = mongoose.model('User', UserSchema)
const MessageSchema = require('./models/Message')
const Message = mongoose.model('Message', MessageSchema)


const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/chatron')

db.on('connected', () => {
  console.log("Database is connected")
  start()
})

function start () {

  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())
  app.post('/api/signup', require('./api/signup'));
  app.post('/api/sessions/create', require('./api/session/create'));
  app.use((req, res) => res.status(404).json({ error: '404 Not Found' }))

  io.on('connection', (socket) => {
    socket.on('addUser', (user) => {
      console.log("User ------->", user)
      const newUser = new User({
        userId: generatePregistrationId(),
        name: user
      })
      newUser.save((err, newUser) => {
        if (err) throw new Error('Error adding new user to the Database!')
        console.log('Added User: ' + JSON.stringify(newUser))
        io.emit('addUser', newUser)
      })
    })
    socket.on('directMessage', (msg) => {
      console.log('directMessage: ' + JSON.stringify(msg))
      io.emit('directMessage', msg)
    })
  })


  http.listen(PORT, () => {
    console.log(`====> Listening on port ${PORT}...🌎`)
  })

}

// User
//   .find()
//   .exec((err, users) => {
//     if (err) throw new Error('Error retrieving all users from the Database!')
//     console.log("About to emit all users", users)
//     io.emit('receiveUsers', users)
//   })
//
// Message
//   .find()
//   .exec((err, messages) => {
//     if (err) throw new Error('Error retrieving all users from the Database!')
//     io.emit('receiveMessages', messages)
//   })
