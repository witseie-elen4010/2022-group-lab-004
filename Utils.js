var io;
var gameSocket;
// This function is called by index.js to initialize a new game instance.
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });
    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
}
//The 'Create newGame' button was clicked and 'hostCreateNewGame' event occurred.
function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});
    // Join the Room and wait for the players
    this.join(thisGameId.toString());
};
//join button clicked
function playerJoinGame(data) {
    // A reference to the player's Socket.IO socket object
    var sock = this;
    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.manager.rooms["/" + data.gameId];
    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;
        // Join the room
        sock.join(data.gameId);
        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
    } else {
        this.emit('error',{message: "This room does not exist."} );
    }
}