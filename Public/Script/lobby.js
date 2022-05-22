const NewGamebtn = document.getElementById('createNewGame')
const JoinGamebtn = document.getElementById('JoinGame')
const gameCodeinput = document.getElementById('gameCodeInput')

newGameBtn.addEventListener('click', function(){
  
});

joinGameBtn.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "singleplayer")
}, false)