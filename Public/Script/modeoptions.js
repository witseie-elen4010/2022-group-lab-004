const button = document.getElementById('singlePlayerMode')
button.addEventListener('click', function () {
  location = String(location).replace("modeoption", "singleplayer")
}, false)