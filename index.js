'use strict'

const path = require('path')
const express = require('express')
const app = express()

const homeRoute = require('./Routes/homeRoute')
const modeRoute = require('./Routes/modeRoute')
const wordleAccountManager = require('./Backend/WordleaccountManagement')

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

app.get('/signUp', function(req, res){
  res.sendFile(path.join(__dirname + "/Views/Register.html"))
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

app.post('/api/register-user', (req,res) => {
  console.log(req.body.username)
  wordleAccountManager.addUser(req.body, req, res)
})
const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
