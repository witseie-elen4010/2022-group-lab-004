const express = require('express')
const path = require('path')
const mockGames = require('../MockGames')

const router = express.Router()

router.get('/multiplayer/random', function (request, response) {
    const id = request.query.id
    response.send(mockGames.getGame(id))
  })
  
router.get('/multiplayer/choose', function (request, response) {
    response.sendFile(path.join(__dirname, '../Views', 'singleplayer.html'))
  })

module.exports = router