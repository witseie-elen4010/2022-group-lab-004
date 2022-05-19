'use strict'

const mssql = require('mssql')

const config = {
  server: 'wordlevs.database.windows.net',
  database: 'WordleDB',
  user: 'tshililopercy',
  password: 'Chililopercy7',
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

const pools = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected To mssql Database')
    return pool
  })
  .catch(err => {
    console.log('Database Connection Failed! Bad Config: ', err)
  })
module.exports = {
  sql: mssql,
  pools: pools,
}