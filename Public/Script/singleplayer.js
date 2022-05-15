'use strict'

const boxGridDisplay = document.querySelector('.BoxGrid-container')

let MatchingIndex = []
let IncludedIndex = []

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

const insertLetter = (letter) => {
  const box = document.getElementById('gridRow-' + currentGridRow + '-box-' + currentBox)
  box.textContent = letter
  boxGrid[currentGridRow][currentBox] = letter
  box.setAttribute('data', letter)
  currentBox++
  console.log('boxGrid', boxGrid)
}

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
    
    Score.incrementScore()
  }).catch(() => {
    window.alert('word not in a dictioanary')
  })
}

const UpdateGamePlay = () => {
  if (currentBox > 4) {
    if (isCorrectGuess()) {
      console.log('You Won')
      isGameOver = true
    } else {
      if (currentGridRow >= 5) {
        isGameOver = true
        console.log('You Lost')
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
  const box = document.getElementById('gridRow-' + currentGridRow + '-box-' + currentBox)
  box.textContent = ''
  boxGrid[currentGridRow][currentBox] = ''
  box.setAttribute('data', '')
}

const Score = {
  value: {
    score: 0,
    display: null
  },

  incrementScore () {
    this.value.score += 10
  },

  decrementScore () {
    this.value.score -= 10
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
      'Q', 'W', 'E', 'T', 'Y', 'U', 'I', 'O', 'P', 'backspace',
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
})
