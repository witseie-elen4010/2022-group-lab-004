const socket = io()
const NewGamebtn = document.getElementById('createNewGame')

//socket.on('Joinedlobby', () =>{
//  console.log('player1 event triggered')
//})

//setTimeout(()=>{
//  socket.emit('join')
//},3000)


NewGamebtn.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "singleplayer")
}, false)