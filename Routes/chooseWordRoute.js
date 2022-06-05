const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/chooseWord', function (req, res) {
  res.sendFile(path.join(__dirname, '../Views', 'chooseWord.html'))
})

module.exports = router
