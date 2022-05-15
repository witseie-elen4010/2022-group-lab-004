'use strict'

const path = require('path')
const express = require('express')
const app = express()

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')
const lobbyRoute = require('./Routes/lobbyRoute')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)
app.use('/', lobbyRoute)

app.get('/singleplayer', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
})

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
