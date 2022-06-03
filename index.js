'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')

const socketIo = require('socket.io')

const server = http.createServer(app)
const io = socketIo(server)

const lobbyRooms = {}

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')
const wordleAccountManager = require('./Backend/WordleaccountManagement')
const score = require('./Backend/score')
const log = require('./Backend/logActions')

const mod = require('./WordList.js')
const lobbyRoute = require('./Routes/lobbyRoute')
const loginRoute = require('./Routes/loginRoute')

const { makeid } = require('./utils')

let solutionWord

app.set('view engine', 'ejs')
app.set('views', './Views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  session({
    secret: 'Wordle cookie',

    cookie: {},

    resave: false,
    saveUnitialized: true

  })
)
app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)
app.use('/', lobbyRoute)
app.use('/', loginRoute)

mod.RandomSolutionWord()
solutionWord = mod.getSolutionWord()
console.log(solutionWord)

app.get('/singleplayer', function (request, response) {
  mod.RandomSolutionWord()
  solutionWord = mod.getSolutionWord()
  console.log(solutionWord)
  response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
})

app.get('/multiPlayer', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'multiPlayer.html'))
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'Views', 'Register.html'))
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
  log.logSignIn(req)
})

app.post('/api/logout-user', (req, res) => {
  wordleAccountManager.LogoutUser(req.body, req, res)
  log.logSignOut(req)
})

app.post('/api/register-user', (req, res) => {
  wordleAccountManager.RegisterUser(req.body, req, res)
  log.logSignUp(req)
})

app.post('/api/scoreInit', (req, res) => {
  score.initScore(req)
  res.json('done')
})

app.post('/api/scoreGet', (req, res) => {
  score.getScore(req)
    .then(value => res.json(value))
})

app.post('/api/scorePost', (req, res) => {
  score.postScore(req)
  res.json('done')
})

app.post('/api/endGame', (req, res) => {
  res.redirect(req.body.href + '/result')
})

app.get('/result', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'result.html'))
})

io.on('connection', player => {
  console.log('We have a new client:' + player.id)
  io.sockets.emit('clientID', player.id)
  player.on('createNewGame', hostCreateNewGame)
  player.on('joinGame', PlayerJoinsGame)
  player.on('Evaluate', ClientGuessedWord)

  function PlayerJoinsGame (JoinDetails) {
    const clientID = JoinDetails.clientID
    const lobbyroomID = JoinDetails.gameID

    if (lobbyRooms[lobbyroomID] === undefined) {
      io.to(clientID).emit('InvalidRoom', lobbyroomID)
      return
    }

    for (const client of lobbyRooms[lobbyroomID].clients) {
      if (client.clientID === clientID) {
        io.to(clientID).emit('AlreadyJoined')
        return
      }
    }
    /*
    lobbyRooms[lobbyroomID].clients.forEach(client => {
      if (client.clientID === clientID) {
        io.to(clientID).emit('AlreadyJoined')
      }
    })
    */
    console.log(lobbyRooms[lobbyroomID].clients.length)
    if (lobbyRooms[lobbyroomID].clients.length === 3) {
      io.to(clientID).emit('GameFull')
      return
    } else {
      lobbyRooms[lobbyroomID].clients.push({
        clientID
      })
    }

    console.log(lobbyRooms[lobbyroomID].clients.length)
    lobbyRooms[lobbyroomID].clients.forEach(client => {
      io.to(client.clientID).emit('joinGame', lobbyRooms)
    })
  }

  function hostCreateNewGame () {
    // Generate Game Room Unique ID
    const roomId = makeid(7)
    lobbyRooms[roomId] = {
      id: roomId,
      clients: [],
      gameState: {}
    }
    console.log(lobbyRooms[roomId].id)
    player.emit('create', lobbyRooms[roomId])
  }

  function ClientGuessedWord (GuessingInfo) {
    const clientID = GuessingInfo.clientID
    const gameID = GuessingInfo.gameID
    const guessedWord = GuessingInfo.guessedWord

    let MatchingIndex = []
    let IncludedIndex = []
    let EvaluationResults = []

    EvaluationResults = mod.EvaluateGuess(guessedWord)

    MatchingIndex = EvaluationResults[0]
    IncludedIndex = EvaluationResults[1]

    const gameState = {
      MatchingIndex,
      IncludedIndex,
      clientID,
      guessedWord
    }

    lobbyRooms[gameID].gameState = gameState

    console.log(lobbyRooms[gameID].gameState)

    lobbyRooms[gameID].clients.forEach(client => {
      // Sending Game With Results To the Room Game Room Clients
      io.to(client.clientID).emit('Results', lobbyRooms)
    })

    player.on('disconnect', () => {
      console.log('Client With ID: ' + player.id + 'disconnected')
    })
  }
})

app.post('/api/endGameMulti', (req, res) => {
  res.redirect(req.body.href + '/resultMulti')
})

app.get('/resultMulti', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'resultMulti.html'))
})

app.post('/api/logAction', (req, res) => {
  if (req.body.action === 'startSingle') {
    log.logStartSingle(req)
    res.json('done')
  }
  if (req.body.action === 'startMultiRand') {
    log.logStartMultiRand(req)
    res.json('done')
  }
  if (req.body.action === 'guessWord') {
    log.logGuessWord(req)
    res.json('done')
  }
  if (req.body.action === 'startMultiChoose') {
    log.logStartMultiChoose(req)
    res.json('done')
  }
  if (req.body.action === 'accessLog') {
    log.logAccessLog(req)
      .then(data => {
        log.accessLog()
          .then(actions => {
            res.json(actions)
          })
      })
  }
})

app.get('/log', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'log.html'))
})

const port = process.env.PORT || 3000
server.listen(port)
console.log('Express server running on port', port)
