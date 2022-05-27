const database = require('./database_Connection')

module.exports.logSignUp = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Sign Up'
  const playerID = req.body.username
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)
}

module.exports.logSignIn = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Sign In'
  const playerID = req.body.username
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)
}

module.exports.logSignOut = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Sign Out'
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)
}

module.exports.logStartSingle = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Started singleplayer game'
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type) 
}

module.exports.logStartMultiRand = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Started multiplayer game (random word)'
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)   
}

module.exports.logStartMultiChoose = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Started multiplayer game (choose word)'
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)   
}

module.exports.logGuessWord = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = `Guessed the word: ${req.body.word}`
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)   
}

module.exports.logAccessLog = async function (req) {
  const pool = await database.pools
  const dateAndTime = new Date().toLocaleString()
  const nature = 'Accessed the log'
  const playerID = req.session.user
  const unixTime = Math.floor(Date.now() / 1000)
  const type = `INSERT INTO dbo.Log (dateAndTime, nature, playerID, unixTime) VALUES ('${dateAndTime}', '${nature}', '${playerID}', '${unixTime}')`
  await pool.request().query(type)     
}

module.exports.accessLog = async function () {
  const pool = await database.pools
  const actions = await pool.request().query(`SELECT top 20 * from dbo.Log ORDER BY unixTime DESC`)
  return actions
}
