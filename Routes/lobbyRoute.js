const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/multiPlayer', function (req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    const message = 'Please Login'
    res.render('Error.ejs',
      { error: 'User not authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    res.sendFile(path.join(__dirname, '../Views', 'multiPlayer.html'))
  }
})

module.exports = router
