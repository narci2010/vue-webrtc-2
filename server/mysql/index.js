const mysql = require('mysql')
const config = require('../config')
const pool = mysql.createPool({
  connectionLimit: 32,
  port: config.port,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

pool.getConnection(function(err, connection) {
  if (err) {
    console.log('mysql connect error: %s', err)
  } else {
    console.log('mysql connect success!')
  }
})

module.exports = {
  pool
}
