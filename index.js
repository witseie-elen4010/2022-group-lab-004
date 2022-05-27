'use strict'

const path = require('path')
const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')
const wordleAccountManager = require('./Backend/WordleaccountManagement')
const score = require('./Backend/score')
const log = require('./Backend/logActions')

const mod = require('./WordList.js')
const lobbyRoute = require('./Routes/lobbyRoute')
const loginRoute = require('./Routes/loginRoute')

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

app.post('/api/endGameMulti', (req, res) => {
  res.redirect(req.body.href + '/resultMulti')
})

app.get('/resultMulti', function (request, response) {
  response.sendFile(path.join(__dirname, 'Views', 'resultMulti.html'))
})

app.post('/api/logAction', (req, res) => {
  if(req.body.action === 'startSingle') {
    log.logStartSingle(req)
    res.json('done')
  }
  if(req.body.action === 'startMultiRand') {
    log.logStartMultiRand(req)
    res.json('done')
  }
  if(req.body.action === 'guessWord') {
    log.logGuessWord(req)
    res.json('done')
  }
  if(req.body.action === 'startMultiChoose') {
    log.logStartMultiChoose(req)
    res.json('done')
  }
  if(req.body.action === 'accessLog') {
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
app.listen(port)
console.log('Express server running on port', port)
