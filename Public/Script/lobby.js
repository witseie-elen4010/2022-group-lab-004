const button = document.getElementById('startGame')

button.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "singleplayer")
}, false)