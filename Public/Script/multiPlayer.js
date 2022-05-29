'use strict'

const boxGridDisplay = document.querySelector('.BoxGrid-container-Left')
const wordToGuess = 'PAUSE'
const clickedLetters = []
const oppponentGrid = []


let MatchingIndex = []
let IncludedIndex = []
let increment = 0


/////////////////////////////////////////////////////////////////////////////////////////////////
//Creating the grid for the player.
/////////////////////////////////////////////////////////////////////////////////////////////////
const boxGrid = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

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
/////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
//Creating a grid for the opponent
/////////////////////////////////////////////////////////////////////////////////////////////////

const gridBoxes = document.getElementById("BoxGrid-container-Right")

createBox()

function createBox() {

  
    for (let index = 0; index <30; index++){
      let boxes = document.createElement("div")
      boxes.classList.add("boxes")
      boxes.setAttribute("id", index + 1)
      oppponentGrid.push(boxes)
      gridBoxes.appendChild(boxes)
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////
//Adds letter to the player's grid
/////////////////////////////////////////////////////////////////////////////////////////////////
const insertLetter = (letter) => {
  const box = document.getElementById('gridRow-' + currentGridRow + '-box-' + currentBox)
  box.textContent = letter
  boxGrid[currentGridRow][currentBox] = letter
  box.setAttribute('data', letter)
  currentBox++
  console.log('boxGrid', boxGrid)
}
/////////////////////////////////////////////////////////////////////////////////////////////////



const isCorrectGuess = () => {
  return !MatchingIndex.includes(false)
}

const WordEvaluation = (guessedWord) => {
  const data = { guessedWord }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('/api', options)
    .then(response => response.json())
    .then(data => {
      MatchingIndex = data.MatchingIndex
      IncludedIndex = data.IncludedIndex
      changeBox(guessedWord)
      UpdateGamePlay()

    })
    .catch((error) => {
      console.error('Error:', error)
    })
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
            console.log('clickedLetters:' +clickedLetters)

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


/////////////////////////////////////////////////////////////////////////////////////////////////
//Adding colour to the Grid and the keyboard
/////////////////////////////////////////////////////////////////////////////////////////////////
const changeBox = (guessedWord) => {

  //get all the chidren of that row
  const rowBox = document.querySelector('#gridRow-' + currentGridRow).childNodes//'#' makes sure to tell we are looking for an id

  // Remove letter once it has been coloured to prevent double colouring

  const guess = []
  Score.setZero()
  
  rowBox.forEach((box,index) => {

      guess.push({letter: box.getAttribute('data'), styling: 'greyColour'})
      Score.decrementScore(50)
  })   

  guess.forEach((guess,index) => {
      if (IncludedIndex[index] == true) {
          guess.styling = 'yellowColour'
          Score.incrementScore(20)

      }
    })

  //Check if each guess is a match
  guess.forEach((guess, index) => {
    if (MatchingIndex[index] == true) {
        guess.styling = 'greenColour'
        Score.incrementScore(30)
    }
  })


  rowBox.forEach((box, index) => {
      setTimeout(() => {
          box.classList.add('flip')
          box.classList.add('greyColour')
          if (IncludedIndex[index] == true ) {
            box.classList.add('yellowColour')

           }
          if (MatchingIndex[index] == true) {
          box.classList.add('greenColour')

          }

      }, 250 * index)
  })

  for (let ind = clickedLetters.length -5; ind< clickedLetters.length; ind++)
  {
    //initialisng the 5 latest clicked keys with the colour grey.
    clickedLetters[ind].classList.add('greyColour')

    let remainder = ind%5 // limiting the indicies to a maximum of 5
    if (IncludedIndex[remainder] == true ) {
      clickedLetters[ind].classList.remove('greenColour') //removing any green so that it will not overwrite the yellow
      clickedLetters[ind].classList.add('yellowColour')
    } 
    if (MatchingIndex[remainder] == true) {


      clickedLetters[ind].classList.add('greenColour')

      }

  }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //Adding colour to the opponent
    /////////////////////////////////////////////////////////////////////////////////////////////////
    for (let index = 0; index < 5; index++)
    {
      let gridIndex = index+(5*currentGridRow)
      setTimeout( ()  => {
        oppponentGrid[gridIndex].classList.add('flip')
        oppponentGrid[gridIndex].classList.add('greyColour')
        if (IncludedIndex[index] ===true){
          
          oppponentGrid[gridIndex].classList.add('yellowColour')
        }
        if (MatchingIndex[index] === true){
          oppponentGrid[gridIndex].classList.add('greenColour')
        }
        console.log("checking how many times this ran: "+index+" for opponent: "+gridIndex)
      }, 250*index  )
    /////////////////////////////////////////////////////////////////////////////////////////////////

    }
    scoreEvaluation()
    logGuess(guessedWord)
}

/////////////////////////////////////////////////////////////////////////////////////////////////
const initScoreValue = () => {
  const score = Score.getScore()
  const data = {score}
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
    const pass = {score}
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
  .catch((error) => {
    console.error('Error:', error)
  })
}

const endGame = () => {
  location = String(location).replace('multiPlayer', 'resultMulti')
  const req = {location}
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
  const data = {word, action}
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
