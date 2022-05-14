const button = document.getElementById('createNewGame')
button.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "singleplayer")
}, false)