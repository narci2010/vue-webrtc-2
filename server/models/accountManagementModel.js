const pool = require('../mysql/').pool

// const htmlToText = function(html) {
//   return html.replace().replace(/<[^>]+>/g, '').replace(/\n/g, '')
// }

exports.fetchLogin = function(data) {
  const { username, password } = data
  const sqlStr = `
  SELECT id, image_path FROM users WHERE user_name='${username}' && pwd='${password}' Limit 1
  `
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) reject(err)
      else {
        connection.query(sqlStr, function(error, results, fields) {
          if (error || !results.length) reject(error || '')
          else {
            resolve({
              userId: results[0].id,
              userImage: results[0].image_path
            })
          }
        })
      }
      connection.release()
    })
  })
}

exports.getUserImage = function(userId) {
  const sqlStr = `
  SELECT image_path FROM users WHERE id='${userId}' Limit 1
  `
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) reject(err)
      else {
        connection.query(sqlStr, function(error, results, fields) {
          if (error || !results.length) reject(error || '')
          else {
            resolve({
              userImage: results[0].image_path
            })
          }
        })
      }
      connection.release()
    })
  })
}
