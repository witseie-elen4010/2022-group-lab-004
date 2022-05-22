const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/singleplayer', function (request, response) {
    response.sendFile(path.join(__dirname, '../Views', 'singleplayer.html'))
  })

module.exports = router