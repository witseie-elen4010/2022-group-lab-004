const games = [
    {
        gameID: 1,
        description: 'This is game 1'
    },
    {
        gameID: 2,
        description: 'This is game 2'
    },
    {
        gameID: 3,
        description: 'This is game 3'
    }]



module.exports = {
getGame:  function (gameID)
    {
        return games.find((game) => {
            return game.gameID == gameID
        })
    }
}