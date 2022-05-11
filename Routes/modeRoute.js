const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/modeoption', function (req, res) {
  res.sendFile(path.join(__dirname, '../Views', 'modeoption.html'))
})

module.exports = router