const singleButton = document.getElementById('singlePlayerMode')
button.addEventListener('click', function () {
  location = String(location).replace("modeoption","singleplayer")
}, false)

const randomButton = document.getElementById('multiplayerModeRandom')
button.addEventListener('click', function () {
  location = String(location).replace("modeoption",  "hostlobby")
}, false)

const chooseButton = document.getElementById('multiplayerModeChoose')
button.addEventListener('click', function () {
  location = String(location).replace("modeoption", "/multiplayer/choose")
}, false)