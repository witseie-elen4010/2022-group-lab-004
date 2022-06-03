'use strict'

const socket = io('/')

let Id
let gameId
let OpponentClientID

// Getting Lobby Front Page Elements
const Newgamebutton = document.getElementById('createNewGame')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')
const gameIdInput = document.getElementById('gameCodeInput')
const Joinbutton = document.getElementById('JoinGame')

// Server response For Client Connection.
socket.on('clientID', function (data) {
  if (Id === undefined) {
    Id = data
    console.log(Id)
  }
})

socket.on('GameFull', function () {
  gameId = null
  window.alert('Game Room Is Full')
})

socket.on('InvalidRoom', (ID) => {
  gameId = null
  window.alert('Room with ID: ' + ID + 'Does not Exist')
})

socket.on('AlreadyJoined', () => {
  window.alert('You Already Joined Please Wait For Another')
})

// Join And Game Create Event Listeners
Newgamebutton.addEventListener('click', clickCreateNewGame)
Joinbutton.addEventListener('click', clickJoinGame)

function clickCreateNewGame () {
  socket.emit('createNewGame', Id)
}

// Client receive created Game room.
socket.on('create', (game) => {
  gameId = game.id

  gameCodeDisplay.innerText = game.id
  gameIdInput.value = game.id

  console.log('Game with ID: ' + gameId + ' Successfully Created')
})

function clickJoinGame () {
  if (gameId == null) {
    gameId = gameIdInput.value
  }
  const JoinDetails = {
    clientID: Id,
    gameID: gameId
  }
  socket.emit('joinGame', JoinDetails)
}

// Joined Game state is Received by the Client
socket.on('joinGame', (payLoad) => {
  console.log(payLoad[gameId].clients)
  payLoad[gameId].clients.forEach(function (client) {
    if (client.clientID !== Id) {
      OpponentClientID.push(client.clientID)
      console.log('Opponent ID: ' + OpponentClientID)
    }
  })

  if (payLoad[gameId].clients.length >= 3) {
    init()
  } else {
    window.alert('Waiting For The Other Player')
  }
})

// Client Receieve Game State With GuessedWord Evaluation
socket.on('Results', (game) => {
  MatchingIndex = game[gameId].gameState.MatchingIndex
  IncludedIndex = game[gameId].gameState.IncludedIndex

  const Opponent = {
    clientID1: OpponentClientID[0],
    clientID2: OpponentClientID[1]
  }
  if (game[gameId].gameState.clientID === Id) {
    console.log('This is True')
    // Update Game And Color Player Board and Key Board
    changeBox(JSON.stringify(game[gameId].gameState.guessedWord))
    UpdateGamePlay()
  } else {
    if (game[gameId].gameState.clientID === Opponent.clientID1) {
      ColorOpponentBoard()
    }
    if (game[gameId].gameState.clientID === Opponent.clientID2) {
      SecondColorOpponentBoard()
    }
  }
})

// Change Display Style OF game screen and Initial Page
function init () {
  initialScreen.style.display = 'none'
  gameScreen.style.display = 'block'
  keyboardBoardID.style.display = 'block'
}

const boxGridDisplay = document.querySelector('.BoxGrid-container-Left')
const clickedLetters = []

let MatchingIndex = []
let IncludedIndex = []

/// //////////////////////////////////////////////////////////////////////////////////////////////
// Creating the grid for the player.
/// //////////////////////////////////////////////////////////////////////////////////////////////
const boxGrid = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

let OpponentcurrentRow = 0
let SecondOpponentcurrentRow = 0
let currentGridRow = 0
let currentBox = 0
let isGameOver = false
boxGrid.forEach((gridRow, gridRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'gridRow-' + gridRowIndex)

  gridRow.forEach((grid, boxIndex) => {
    const boxElement = document.createElement('div')
    boxElement.setAttribute('id', 'gridRow-' + gridRowIndex + '-box-' + boxIndex)
    boxElement.classList.add('box')
    rowElement.append(boxElement)
  })
  boxGridDisplay.appendChild(rowElement)
})
/// //////////////////////////////////////////////////////////////////////////////////////////////

// First Opponent Grid

const OpponenttileDisplay = document.querySelector('.BoxGrid-container-Right')

const OpponentguessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

OpponentguessRows.forEach((opponentguessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'OpponentguessRow-' + guessRowIndex)

  opponentguessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'OpponentguessRow-' + guessRowIndex + '-box-' + guessIndex)
    tileElement.classList.add('box')
    rowElement.append(tileElement)
  })
  OpponenttileDisplay.appendChild(rowElement)
})

// Second Opponent Grid
const SecondOpponenttileDisplay = document.querySelector('.BoxGrid-container-Right2')

const SecondOpponentguessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

SecondOpponentguessRows.forEach((opponentguessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'SecondOpponentguessRow-' + guessRowIndex)

  opponentguessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'SecondOpponentguessRow-' + guessRowIndex + '-box-' + guessIndex)
    tileElement.classList.add('box')
    rowElement.append(tileElement)
  })
  SecondOpponenttileDisplay.appendChild(rowElement)
})

/// //////////////////////////////////////////////////////////////////////////////////////////////
// Adds letter to the player's grid
/// //////////////////////////////////////////////////////////////////////////////////////////////
const insertLetter = (letter) => {
  const box = document.getElementById('gridRow-' + currentGridRow + '-box-' + currentBox)
  box.textContent = letter
  boxGrid[currentGridRow][currentBox] = letter
  box.setAttribute('data', letter)
  currentBox++
  console.log('boxGrid', boxGrid)
}
/// //////////////////////////////////////////////////////////////////////////////////////////////

const isCorrectGuess = () => {
  return !MatchingIndex.includes(false)
}

const WordEvaluation = (guessedWord) => {
  const payLoad = {
    clientID: Id,
    gameID: gameId,
    guessedWord
  }
  // Sends Guessword for Evaluation
  socket.emit('Evaluate', payLoad)
}

const GuessedWordValidation = (guessedWord) => {
  fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`,
    {
      method: 'GET'
    }
  ).then((res) => {
    if (!res.ok) {
      throw Error()
    }

    WordEvaluation(guessedWord)
  }).catch(() => {
    window.alert('word not in a dictioanary')
  })
}

const UpdateGamePlay = () => {
  if (currentBox > 4) {
    if (isCorrectGuess()) {
      console.log('You Won')
      isGameOver = true
      setTimeout(() => {
        window.alert('You won :) Click OK to continue...')
        endGame()
      }, 1500)
    } else {
      if (currentGridRow >= 5) {
        console.log('You Lost')
        isGameOver = true
        setTimeout(() => {
          window.alert('You lost :( Click OK to continue...')
          endGame()
        }, 1500)
      }
      if (currentGridRow < 5) {
        currentGridRow++
        currentBox = 0
      }
    }
  }
}

const SubmitGuessedWord = () => {
  const guessedWord = boxGrid[currentGridRow].join('')

  if (guessedWord.length === 5) {
    GuessedWordValidation(guessedWord)
  } else {
    window.alert('Not Enough Letters')
  }
}

const deleteLetter = () => {
  currentBox--
  if (currentBox < 0) {
    currentBox = 0
  }
  clickedLetters.pop()
  const box = document.getElementById('gridRow-' + currentGridRow + '-box-' + currentBox)
  box.textContent = ''
  boxGrid[currentGridRow][currentBox] = ''
  box.setAttribute('data', '')
}

const Score = {
  value: {
    score: 1500,
    display: null
  },

  setZero () {
    this.value.score = 0
  },

  incrementScore (value) {
    this.value.score += value
  },

  decrementScore (value) {
    this.value.score -= value
  },

  getScore () {
    return this.value.score
  }
}

const Keyboard = {
  properties: {
    board: null,
    keysContainer: null,
    keys: []
  },

  setup () {
    this.properties.board = document.createElement('div')
    this.properties.board.id = 'keyboardBoardID'
    this.properties.keysContainer = document.createElement('div')

    this.properties.board.classList.add('board')
    this.properties.keysContainer.classList.add('keys')
    this.properties.keysContainer.appendChild(this._returnKeys())

    this.properties.keys = this.properties.keysContainer.querySelectorAll('.key')

    this.properties.board.appendChild(this.properties.keysContainer)
    const gameContainer = document.querySelector('.game-container')
    gameContainer.appendChild(this.properties.board)
  },

  _returnKeys () {
    const fragment = document.createDocumentFragment()
    const keyLayout = [
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'backspace',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'enter'
    ]

    const HTMLicon = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`
    }

    keyLayout.forEach(key => {
      const element = document.createElement('button')
      const insertLineBreak = ['backspace', 'L'].indexOf(key) !== -1

      element.setAttribute('type', 'button')
      element.classList.add('key')

      switch (key) {
        case 'backspace':
          element.classList.add('key--wide')
          element.innerHTML = HTMLicon('backspace')

          element.addEventListener('click', () => {
            if (currentBox > 0 && !isGameOver) {
              deleteLetter()
            }
          })
          break

        case 'enter':
          element.classList.add('key--wide')
          element.innerHTML = HTMLicon('keyboard_return')

          element.addEventListener('click', () => {
            if (!isGameOver) {
              SubmitGuessedWord()
            }
          })
          break

        default:
          element.textContent = key
          element.addEventListener('click', () => {
            insertLetter(key)
            clickedLetters.push(element)
            console.log('clickedLetters:' + clickedLetters)
          })

          break
      }

      fragment.appendChild(element)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'))
      }
    })

    return fragment
  }

}

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.setup()
  initScoreValue()
})

/// //////////////////////////////////////////////////////////////////////////////////////////////
// Adding colour to the Grid and the keyboard
/// /////////////////////////////////////////////////////////////////////////////////////////////

/// //////////////////////////////////////////////////////////////////////////////////////////////
// Adding colour to the Grid and the keyboard
/// //////////////////////////////////////////////////////////////////////////////////////////////
const changeBox = (guessedWord) => {
  // get all the chidren of that row
  const rowBox = document.querySelector('#gridRow-' + currentGridRow).childNodes// '#' makes sure to tell we are looking for an id

  // Remove letter once it has been coloured to prevent double colouring

  const guess = []
  Score.setZero()

  rowBox.forEach((box, index) => {
    guess.push({ letter: box.getAttribute('data'), styling: 'greyColour' })
    Score.decrementScore(50)
  })

  guess.forEach((guess, index) => {
    if (IncludedIndex[index] === true) {
      guess.styling = 'yellowColour'
      Score.incrementScore(20)
    }
  })

  // Check if each guess is a match
  guess.forEach((guess, index) => {
    if (MatchingIndex[index] === true) {
      guess.styling = 'greenColour'
      Score.incrementScore(30)
    }
  })

  rowBox.forEach((box, index) => {
    setTimeout(() => {
      box.classList.add('flip')
      box.classList.add('greyColour')
      if (IncludedIndex[index] === true) {
        box.classList.add('yellowColour')
      }
      if (MatchingIndex[index] === true) {
        box.classList.add('greenColour')
      }
    }, 250 * index)
  })

  for (let ind = clickedLetters.length - 5; ind < clickedLetters.length; ind++) {
    // initialisng the 5 latest clicked keys with the colour grey.
    clickedLetters[ind].classList.add('greyColour')

    const remainder = ind % 5 // limiting the indicies to a maximum of 5
    if (IncludedIndex[remainder] === true) {
      clickedLetters[ind].classList.remove('greenColour') // removing any green so that it will not overwrite the yellow
      clickedLetters[ind].classList.add('yellowColour')
    }
    if (MatchingIndex[remainder] === true) {
      clickedLetters[ind].classList.add('greenColour')
    }
  }

  scoreEvaluation()
  logGuess(guessedWord)
}

// Color The Opponent Board
const ColorOpponentBoard = () => {
  const rowTiles = document.querySelector('#OpponentguessRow-' + OpponentcurrentRow).childNodes
  rowTiles.forEach((tile, index) => {
    if (MatchingIndex[index]) {
      tile.classList.add('greenColour')
    } else if (IncludedIndex[index]) {
      tile.classList.add('yellowColour')
    } else {
      tile.classList.add('greyColour')
    }
  })
  if (OpponentcurrentRow < 5) {
    OpponentcurrentRow++
  }
}

// Color Second Opponent Board
const SecondColorOpponentBoard = () => {
  const rowTiles = document.querySelector('#SecondOpponentguessRow-' + SecondOpponentcurrentRow).childNodes
  rowTiles.forEach((tile, index) => {
    if (MatchingIndex[index]) {
      tile.classList.add('greenColour')
    } else if (IncludedIndex[index]) {
      tile.classList.add('yellowColour')
    } else {
      tile.classList.add('greyColour')
    }
  })
  if (SecondOpponentcurrentRow < 5) {
    SecondOpponentcurrentRow++
  }
}

/// //////////////////////////////////////////////////////////////////////////////////////////////
const initScoreValue = () => {
  const score = Score.getScore()
  const data = { score }
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/api/scoreInit', options)
    .then(res => res.json())
    .catch((error) => {
      console.error('Error:', error)
    })
}

const scoreEvaluation = () => {
  const id = document.cookie
  let pass = { id }
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch('/api/scoreGet', options)
    .then(response => response.json())
    .then(data => {
      Score.incrementScore(data)
      const score = Score.getScore()
      pass = { id, score }
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pass)
      }
      fetch('/api/scorePost', options)
        .then(res => res.json())
        .catch((error) => {
          console.error('Error:', error)
        })
    })
    .then(response => response.json())
    .then(data => {
      Score.incrementScore(data)
      const score = Score.getScore()
      const pass = { score }
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pass)
      }
      fetch('/api/scorePost', options)
        .then(res => res.json())
        .catch((error) => {
          console.error('Error:', error)
        })
    })
}

const endGame = () => {
  location = String(location).replace('multiPlayer', 'resultMulti')
  const req = { location }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  }
  fetch('/api/endGameMulti', options)
    .catch((error) => {
      console.error('Error:', error)
    })
}

const logGuess = (guessedWord) => {
  const word = guessedWord
  const action = 'guessWord'
  const data = { word, action }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/api/logAction', options)
    .catch((error) => {
      console.error('Error:', error)
    })
}
