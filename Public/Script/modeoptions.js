const buttonSingle = document.getElementById('singlePlayerMode')
buttonSingle.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'singleplayer')
  const action = 'startSingle'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action })
  }
  fetch('/api/logAction', options)
    .then(result => result.json())
    .catch((error) => {
      console.error('Error:', error)
    })
})
const randomButton = document.getElementById('multiplayerModeRandom')
randomButton.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'chooseLeader')
}, false)

const chooseButton = document.getElementById('multiplayerModeChoose')
chooseButton.addEventListener('click', function () {
  location = String(location).replace('modeoption', 'chooseLeader')
}, false)
