const express = require('express')
const path = require('path')
const localdatabase = require('../LocalDatabase')

const router = express.Router()

router.get('/hostlobby', function (request, response) {
    const id = request.query.id
    response.send(localdatabase.getGame(id))
  })
  
router.get('/hostlobby', function (request, response) {
    response.sendFile(path.join(__dirname, '../Views', 'hostlobby.html'))
  })

module.exports = router