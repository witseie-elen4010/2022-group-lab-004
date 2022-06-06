'use strict'

const mssql = require('mssql')

// The MSSQL Database Configurations
const config = {
  server: 'wordlevs.database.windows.net',
  database: 'WordleDB',
  user: process.env.AzureDBAdmin,
  password: process.env.AzureDBPassword,
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

/// creating Pool connection
const pools = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected To mssql Database')
    return pool
  })
  .catch(err => {
    console.log('Database Connection Failed! Bad Config: ', err)
  })

// Export created pool object and Mssql object
module.exports = {
  sql: mssql,
  pools
}
