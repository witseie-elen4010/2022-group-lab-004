const database = require('./database_Connection')

module.exports.initScore = async function(req) {
  const initScore = 0
  try {
    let type = `SELECT score FROM dbo.Score WHERE id = '${req}'`
    const pool = await database.pools
    const request = await pool.request()
    request.query(type, function (err, result) {
      if (err) throw err
      console.log(result)
      if (result.rowsAffected[0] === 0) {
        type = `INSERT INTO dbo.Score (id, score) VALUES ('${req}', '${initScore}')`
        request.query(type, function (err, result) {
          if (err) throw err
          console.log('Score initialised!')
        })
      } else {
        type = `UPDATE dbo.Score SET score = '${initScore}' WHERE id = '${req}'`
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
    let type = `SELECT score FROM dbo.Score WHERE id = '${req}'`
    const pool = await database.pools
    const request = await pool.request().query(type)
    console.log("Score retrieved!")
    return request.recordset[0].score
  } catch (err) {
    console.log(err)
  }
}

module.exports.postScore = async function(req) {
  const id = req.body.id
  const newScore = req.body.score
  try {
    let type = `UPDATE dbo.Score SET score = '${newScore}' WHERE id = '${id}'`
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
