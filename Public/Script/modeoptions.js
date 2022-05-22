'use strict'

const buttonSingle = document.getElementById('singlePlayerMode')
buttonSingle.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'hostlobby')
}, false)

const buttonMultiRand = document.getElementById('multiplayerModeRandom')
buttonMultiRand.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'hostlobby') // Change hostlobby to appropriate location if necessary
}, false)
