'use strict'

const displayResults = document.getElementById('displayLog')
const action = 'accessLog'
let options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({action})
}
fetch('/api/logAction', options)
.then(response => response.json())
.then(data => {
  data.recordset.forEach(element => {
    const displayText = document.createElement('h5')
    const text = document.createTextNode(`${element.playerID} ${element.nature} ${element.dateAndTime}`)
    displayText.appendChild(text)
    displayResults.appendChild(displayText)
  })
})
.catch((error) => {
  console.error('Error:', error)
})
