const database = require('./database_Connection')

module.exports.initScore = async function(req) {
  try {
    let type = `SELECT score FROM dbo.Score WHERE id = '${req.session.user}'`
    const pool = await database.pools
    const request = await pool.request()
    request.query(type, function (err, result) {
      if (err) throw err
      console.log(result)
      if (result.rowsAffected[0] === 0) {
        type = `INSERT INTO dbo.Score (id, score) VALUES ('${req.session.user}', '${req.body.score}')`
        request.query(type, function (err, result) {
          if (err) throw err
          console.log('Score initialised!')
        })
      } else {
        type = `UPDATE dbo.Score SET score = '${req.body.score}' WHERE id = '${req.session.user}'`
        request.query(type, function (err, result) {
          if (err) throw err
          console.log('Entry reinitialised!')
        })
      }
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports.getScore = async function(req) {
  try {
    let type = `SELECT score FROM dbo.Score WHERE id = '${req.session.user}'`
    const pool = await database.pools
    const request = await pool.request().query(type)
    console.log("Score retrieved!")
    return request.recordset[0].score
  } catch (err) {
    console.log(err)
  }
}

module.exports.postScore = async function(req) {
  try {
    let type = `UPDATE dbo.Score SET score = '${req.body.score}' WHERE id = '${req.session.user}'`
    const pool = await database.pools
    const request = await pool.request()
    request.query(type, function (err, result) {
      if (err) throw err
      console.log("Score updated!")
    })
  } catch (err) {
    console.log(err)
  }
}
