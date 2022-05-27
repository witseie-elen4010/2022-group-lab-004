'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')

const lobbyRooms = {};
//var utils = require('./Utils');

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

io.on('connection', player=>{
  player.on('createNewGame', hostCreateNewGame);
  player.on('joiGame', PlayerJoinsGame);

  function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    let roomId = ( Math.random() * 100000 ) | 0;
    lobbyRooms[player.id] = roomId

    player.emit('gameCode', roomId);

    player.join(roomId.toString());

    player.number = 1;
    player.emit('init',1)
  }

  function PlayerJoinsGame(gameCode){
    const room = io.sockets.adapter.rooms[gameCode];

    let allUsers;
    if(room){
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

})

const port = process.env.PORT || 3000
server.listen(port)
  console.log('Express server running on port', port)
