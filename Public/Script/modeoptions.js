const singleButton = document.getElementById('singlePlayerMode')
singleButton.addEventListener('click', function () {
  location = String(location).replace("modeoption","singleplayer")
}, false)

const randomButton = document.getElementById('multiplayerModeRandom')
randomButton.addEventListener('click', function () {
  location = String(location).replace("modeoption",  "multiPlayer")
}, false)

const chooseButton = document.getElementById('multiplayerModeChoose')
chooseButton.addEventListener('click', function () {
  location = String(location).replace("modeoption", "multiPlayer")
}, false)
