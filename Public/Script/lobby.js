const socket = io('http://localhost:3000')

socket.on('init',handleInit);
socket.on('gameCode',handleGameCode)
socket.on('unknownGame',handleUnknowGame)
socket.on('gameIsFull',handleGameIsFull)


const Newgamebutton = document.getElementById('createNewGame')
const Joinbutton = document.getElementById('JoinGame')
const gameIdInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')


Newgamebutton.addEventListener('click', clickCreateNewGame);
Joinbutton.addEventListener('click', clickJoinGame);

function clickCreateNewGame (){
  socket.emit('createNewGame')
  init()
}

function clickJoinGame (){
  const code = gameIdInput.value;
  socket.emit('joinGame',code)
  init()
}

function init(){
  initialScreen.style.display = 'none'
  gameScreen.style.display = 'block'
}

let playerNumber;
function handleInit(number){
  playerNumber = number;
}

function handleGameCode(gameCode){
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknowGame(){
  reset();
  alert('Unknown game code')
}

function handleGameIsFull(){
  reset();
  alert('game already in progress')
}

function reset(){
  playerNumber = null;
  gameIdInput.value = " ";
  gameCodeDisplay.innerText = " ";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}