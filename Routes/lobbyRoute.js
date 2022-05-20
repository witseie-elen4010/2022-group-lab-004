const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/hostlobby', function (req, res) {
  res.sendFile(path.join(__dirname, '../Views', 'hostlobby.html'))
})

module.exports = router