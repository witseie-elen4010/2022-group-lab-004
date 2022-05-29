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
  // Add opponents score
})
.catch((error) => {
  console.error('Error:', error)
})

const accessLogButton = document.getElementById('accessLogButton')
accessLogButton.addEventListener('click', function () {
  location = String(location).replace('resultMulti', 'log')
}, false)
