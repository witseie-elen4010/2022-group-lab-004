const NewGamebtn = document.getElementById('createNewGame')

NewGamebtn.addEventListener('click', function () {

  var lobbyname = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
  var socket = io({
    query: {
      lobbyname: lobbyname,
      console.log(lobbyname)
    },
});
  location = String(location).replace("hostlobby", "singleplayer")
  
}, false)
