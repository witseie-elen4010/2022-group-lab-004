'use strict'

const displayResults = document.getElementById('displayResults')
let score = 0
let options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
fetch('/api/scoreGet', options)
.then(response => response.json())
.then(data => {
  score = data
  const displayText = document.createElement('h5')
  const text = document.createTextNode(`${score}`)
  displayText.appendChild(text)
  displayResults.appendChild(displayText)
})
.catch((error) => {
  console.error('Error:', error)
})