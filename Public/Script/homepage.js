'use strict'

const button = document.getElementById('startButton')
button.addEventListener('click', function () {
  location = String(location).replace("home", "modeoption")
}, false)
