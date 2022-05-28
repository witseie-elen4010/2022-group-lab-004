const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/multiPlayer', function (req, res) {
  res.sendFile(path.join(__dirname, '../Views', 'multiPlayer.html'))
})

module.exports = router