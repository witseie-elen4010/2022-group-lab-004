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
//const loginRoute1 = require('./Routes/login1Route')
const chooseWordRoute = require('./Routes/chooseWordRoute')

const fs = require("fs").promises;// interacts with json
const optionsFile = path.join(__dirname, "options.json");

const { makeid } = require('./utils')
const { setSolutionWord } = require('./WordList.js')
const req = require('express/lib/request')

let solutionWord



app.set('view engine', 'ejs')
app.set('views', './Views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const sessionMiddleware = session({
  secret: 'Wordle cookie',

  cookie: {},

  resave: false,
  saveUnitialized: true

})

app.use(
  sessionMiddleware
)

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleware))
app.use('/cdn', express.static('Public'))
app.use('/', homeRoute)
app.use('/', modeRoute)
app.use('/', lobbyRoute)
app.use('/', loginRoute)
//app.use('/', loginRoute1)
app.use('/', chooseWordRoute)



app.get('/singleplayer', function (request, response) {
  if (request.session.user === undefined || request.session.user === null) {
    const message = 'Please Login'
    response.render('Error.ejs',
      { error: 'User not authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    mod.RandomSolutionWord()
    solutionWord = mod.getSolutionWord()
    console.log(solutionWord)
    response.sendFile(path.join(__dirname, 'Views', 'singleplayer.html'))
  }
})

app.get('/chooseLeader', function (request, response) {

  response.sendFile(path.join(__dirname, 'Views', 'chooseLeader.html'))
})

mod.RandomSolutionWord()
solutionWord = mod.getSolutionWord()
console.log(solutionWord)
app.get('/multiPlayer', function (request, response) {

console.log('this is the:'+solutionWord)
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
app.post('/api/chooseWord', (req, res) => {
  solutionWord = req.body.Word
  setSolutionWord(solutionWord)
  console.log(solutionWord)
})

  res.redirect('/multiPlayer')
app.post('/api/logout-user', (req, res) => {
  wordleAccountManager.LogoutUser(req, res)
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
  if (request.session.user === undefined || request.session.user === null) {
    const message = 'Please Login'
    response.render('Error.ejs',
      { error: 'User not authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    response.sendFile(path.join(__dirname, 'Views', 'result.html'))
  }
})

io.on('connection', player => {
  const user = player.request.session.user

  const User = {
    user,
    playerID: player.id
  }

  console.log('We have a new client:' + player.id)
  io.sockets.emit('clientID', User)
  player.on('createNewGame', hostCreateNewGame)
  player.on('joinGame', PlayerJoinsGame)
  player.on('Evaluate', ClientGuessedWord)

  player.on('LeaveTheLobby', playerLeavesTheLobby)

  function playerLeavesTheLobby () {
  
    player.disconnect()
    console.log('Client With ID: ' + player.id + ' disconnected')
    
  }
  

  function PlayerJoinsGame (JoinDetails) {
    const clientID = JoinDetails.clientID
    const lobbyroomID = JoinDetails.gameID
    const clientName = JoinDetails.ClientName

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
        clientID,
        clientName
      })
    }

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
  if (request.session.user === undefined || request.session.user === null) {
    const message = 'Please Login'
    response.render('Error.ejs',
      { error: 'User not authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    response.sendFile(path.join(__dirname, 'Views', 'resultMulti.html'))
  }
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
  if (request.session.user === undefined || request.session.user === null) {
    const message = 'Please Login'
    response.render('Error.ejs',
      { error: 'User not authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    response.sendFile(path.join(__dirname, 'Views', 'log.html'))
  }
})


// Backend will be able to receive information from frontend
app.use(express.urlencoded({ extended: true }));

 //Enable CORS
 //set a header for every request that comes through
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});


 
app.get("/vote", async (req, res) => {
    let data = JSON.parse(await fs.readFile(optionsFile, "utf-8"));
    const totalVotes = Object.values(data).reduce((total, positions) => total += positions, 0);

    data = Object.entries(data).map(([label, votes]) => {
        return {
            label,
            percentage: (((100 * votes) / totalVotes) || 0).toFixed(0)// gives us a percentage that will return a zero if no vote casted
        }
    });


    res.json(data);
    
});



app.post("/vote", async (req, res) => {
    const data = JSON.parse(await fs.readFile(optionsFile, "utf-8"));

    data[req.body.add]++; //adds to the vote the user chose

    await fs.writeFile(optionsFile, JSON.stringify(data));

    res.end();
});


const port = process.env.PORT || 3000
server.listen(port)
console.log('Express server running on port', port)
