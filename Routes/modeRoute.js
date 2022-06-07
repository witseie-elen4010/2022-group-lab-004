const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/modeoption', function (req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    const message = 'Please Login'
    res.render('Error.ejs',
      { error: 'User not Authenticated', message: message, tips: [], buttonlink: '/login', button: 'Login' })
  } else {
    res.sendFile(path.join(__dirname, '../Views', 'modeoption.html'))
  }
})

module.exports = router
