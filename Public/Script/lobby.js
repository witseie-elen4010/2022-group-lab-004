const button = document.getElementById('JoinGame')
button.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "multiPlayer")
}, false)