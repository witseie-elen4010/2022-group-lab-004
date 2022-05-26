'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
var utils = require('./Utils');

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')


const mod = require('./WordList.js')
const lobbyRoute = require('./Routes/lobbyRoute')

const bodyParser = require('body-parser')

let solutionWord

app.set('view engine', 'ejs')
app.set('views', './Views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)
app.use('/', lobbyRoute)


app.get('/singleplayer', function (request, response) {
  mod.RandomSolutionWord()
  solutionWord = mod.getSolutionWord()
  console.log(solutionWord)
  response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
})

app.post('/api', (req, res) => {
  let MatchingIndex = []
  let IncludedIndex = []
  let EvaluationResults = []

  const guessedWord = req.body.guessedWord
  console.log(guessedWord)

  EvaluationResults = mod.EvaluateGuess(guessedWord)
  MatchingIndex = EvaluationResults[0]
  IncludedIndex = EvaluationResults[1]
  console.log(IncludedIndex)

  res.json({
    MatchingIndex,
    IncludedIndex
  })
})

const port = process.env.PORT || 3000
server.listen(port)
  console.log('Express server running on port', port)

io.sockets.on('connection', socket =>{
  socket.emit('connected', {message: 'You are connected'})
  //host event
  socket.on('hostCreateNewGame',hostCreateNewGame)
  //player event
  socket.on('playerjoinGame',playerJoinGame)  
})