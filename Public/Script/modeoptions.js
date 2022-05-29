const singleButton = document.getElementById('singlePlayerMode')
singleButton.addEventListener('click', function () {
  location = String(location).replace("modeoption","singleplayer")
}, false)

<<<<<<< HEAD
const randomButton = document.getElementById('multiplayerModeRandom')
randomButton.addEventListener('click', function () {
  location = String(location).replace("modeoption",  "multiPlayer")
=======
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
>>>>>>> fa34121cd9828e0e8e3b9b8c4252da1ad6f4fe8f
}, false)

const chooseButton = document.getElementById('multiplayerModeChoose')
chooseButton.addEventListener('click', function () {
  location = String(location).replace("modeoption", "multiPlayer")
}, false)
