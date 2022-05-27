'use strict'

const buttonSingle = document.getElementById('singlePlayerMode')
buttonSingle.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'singleplayer')
  const action = 'startSingle'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action})
  }
  fetch('/api/logAction', options)
  .then(result => result.json())
  .catch((error) => {
    console.error('Error:', error)
  })
}, false)

const buttonMultiRand = document.getElementById('multiplayerModeRandom')
buttonMultiRand.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'hostlobby') // Change hostlobby to appropriate location if necessary
}, false)
