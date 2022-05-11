'use strict'

const boxGridDisplay = document.querySelector('.BoxGrid-container')

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

const submitWord = () => {
  const guessedWord = boxGrid[currentGridRow].join('')

  fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`,
    {
      method: 'GET'
    }
  ).then((res) => {
    if (!res.ok) {
      throw Error()
    }
    console.log('Guessed Word is Valid')
    currentBox = 0
    currentGridRow++
  }).catch(() => {
    window.alert('Guessed Word is not in a dictioanary')
  })
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

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  init () {
    this.elements.main = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')

    this.elements.main.classList.add('keyboard')
    this.elements.keysContainer.classList.add('keyboard_keys')
    this.elements.keysContainer.appendChild(this._createKeys())

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key')

    this.elements.main.appendChild(this.elements.keysContainer)
    document.body.appendChild(this.elements.main)
  },

  _createKeys () {
    const fragment = document.createDocumentFragment()
    const keyLayout = [
      'Q', 'W', 'E', 'T', 'Y', 'U', 'I', 'O', 'P', 'backspace',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'enter'
    ]

    const createIconHTML = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`
    }

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button')
      const insertLineBreak = ['backspace', 'L'].indexOf(key) !== -1

      keyElement.setAttribute('type', 'button')
      keyElement.classList.add('keyboard_key')

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard_key--wide')
          keyElement.innerHTML = createIconHTML('backspace')

          keyElement.addEventListener('click', () => {
            deleteLetter()
          })
          break

        case 'enter':
          keyElement.classList.add('keyboard_key--wide')
          keyElement.innerHTML = createIconHTML('keyboard_return')

          keyElement.addEventListener('click', () => {
            submitWord()
          })
          break

        default:
          keyElement.textContent = key
          keyElement.addEventListener('click', () => {
            insertLetter(key)
          })

          break
      }

      fragment.appendChild(keyElement)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'))
      }
    })

    return fragment
  }

}

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init()
})
