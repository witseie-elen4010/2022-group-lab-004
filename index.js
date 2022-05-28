'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const session = require('express-session')
const app = express()
const socketIo = require('socket.io')

const server = http.createServer(app)
const io = socketIo(server)

const lobbyRooms = {};

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')
const wordleAccountManager = require('./Backend/WordleaccountManagement')
const score = require('./Backend/score')

const mod = require('./WordList.js')
const lobbyRoute = require('./Routes/lobbyRoute')
const loginRoute = require('./Routes/loginRoute')

const bodyParser = require('body-parser')
const { makeid } = require('./utils')

let solutionWord

app.set('view engine', 'ejs')
app.set('views', './Views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  session({
    secret: 'Wordle cookie',
    cookie: {httpOnly: false},
    resave: false,
    saveUnitialized: true

  })
)
app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)
app.use('/', lobbyRoute)
app.use('/', loginRoute)


app.get('/singleplayer', function (request, response) {
  mod.RandomSolutionWord()
  solutionWord = mod.getSolutionWord()
  console.log(solutionWord)
  response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
})

app.get('/multiPlayer', function (request, response) {
  mod.RandomSolutionWord()
  solutionWord = mod.getSolutionWord()
  console.log(solutionWord)
  response.sendFile(path.join(__dirname, 'Views', 'multiPlayer.html'))
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/Views/Register.html'))
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
app.post('/api/login-user', (req, res) => {
  wordleAccountManager.LoginUser(req.body, req, res)
})

app.post('/api/logout-user', (req, res) => {
  wordleAccountManager.LogoutUser(req.body, req, res)
})

app.post('/api/register-user', (req, res) => {
  wordleAccountManager.RegisterUser(req.body, req, res)
})

app.post('/api/scoreInit', (req, res) => {
  score.initScore(req)
})

app.post('/api/scoreGet', (req, res) => {
  score.getScore(req.body.id)
    .then(value => res.json(value))
})

app.post('/api/scorePost', (req, res) => {
  score.postScore(req)
})

app.post('/api/endGame', (req, res) => {
  res.redirect(req.body.href + '/result')
})

app.get('/result', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'result.html'))
})

io.on('connection', player=>{
  player.on('createNewGame', hostCreateNewGame);
  player.on('joinGame', PlayerJoinsGame);

  function PlayerJoinsGame(gameCode){
    //returns current room from the socket object
    const room = io.sockets.adapter.rooms[gameCode];

    let allUsers;
    if(room){
      //gives all of object of the current room
      allUsers = room.sockets;
    }

    let numPlayers = 0;
    if(allUsers){
      numPlayers = Object.keys(allUsers).length;
    }

    if(numPlayers === 0){
      player.emit('unknownGame')
      return;
    }else if(numPlayers > 1){
      player.emit('gameIsFull')
      return;
    }

    lobbyRooms[player.id] = gameCode;
    player.join(gameCode);

    player.number = 2;
    player.emit('init',2)
  }

  function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    let roomId = makeid(7);
    lobbyRooms[player.id] = roomId

    player.emit('gameCode', roomId);

    player.join(roomId);

    player.number = 1;
    player.emit('init',1)
  }

})

const port = process.env.PORT || 3000
server.listen(port)
  console.log('Express server running on port', port)
