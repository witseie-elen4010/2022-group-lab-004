'use strict'

const path = require('path')
const express = require('express')
const app = express()

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)

app.get('/singleplayer', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
})

app.post('/api', (req, res) => {
  const guessedWord = req.body.guessedWord
  console.log(guessedWord)
  res.json({
    guessedWord
  })
})
const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
