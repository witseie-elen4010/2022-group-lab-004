const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '../Views', 'login.html'))
})

module.exports = router
