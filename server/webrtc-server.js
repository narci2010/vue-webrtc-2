const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const IO = require('socket.io')
const io = IO.listen(12345)

// 普通请求部分
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// set json header
app.use(function(req, res, next) {
  res.contentType('application/json')
  req.allUsers = allUsers
  next()
})

const httpCtrl = require('./controllers/httpCtrl')

app.use('/', httpCtrl)

app.listen(12346)

// 所有用户
const allUsers = {}
// 所有客户端
const allSockets = {}

io.on('connect', function (socket) {
  let user = ''
  let conn = ''

  socket.on('message', function(data) {

    switch (data.event) {
      case 'join':
        sendTo(socket, {
          event: 'join',
          success: !allUsers[data.name],
          name: data.name
        })
        if (!allUsers[data.name]) {
          allUsers[data.name] = 'no room'
          allSockets[data.name] = socket
          socket.name = data.name
        }
      break
      // 加入房间
      case 'enterRoom':
        const { roomCode, name, type } = data
        const users = Object.keys(allUsers).filter(key => allUsers[key] === roomCode)
        let message = ''

        if (users.length <= 1) {
          if (users.length === 1) {
            const otherName = Object.keys(allUsers).find(userName => allUsers[userName] === roomCode)

            sendTo(allSockets[otherName], {
              event: 'newUserIn',
              name
            })
          } else if (type === 'join') {
            message = '进入房间失败, 房间不存在'
          } else {
            allUsers[name] = roomCode
            message = (users.length ? '进入' : '新建') + '房间成功'
          }

          // 暂存socket
          user = name
          conn = socket
          socket.name = name
          allSockets[name] = socket
        } else {
          message = '进入房间失败, 房间人数已满'
        }

        sendTo(socket, {
          event: 'enterRoom',
          message,
          roomCode,
          success: message.indexOf('成功') > 0
        })
      break

      case 'candidate':
        const conn1 = allSockets[data.connectedUser]
        const conn2 = allSockets[socket.otherName]
        if (conn1 != null) {
          sendTo(conn1, {
            event: 'candidate',
            candidate: data.candidate
          })
        } else {
          sendTo(conn2, {
            event: 'candidate',
            candidate: data.candidate
          })
        }
      break
      case 'offer':
        // if UserB exists then send him offer details
        conn = allSockets[data.connectedUser]
        allUsers[user] = false
        if (conn != null) {
          // setting that UserA connected with UserB
          socket.otherName = data.connectedUser
          sendTo(conn, {
            event: 'offer',
            offer: data.offer,
            name: socket.name
          })
        } else {
          sendTo(socket, {
            event: 'msg',
            message: 'Not found this name'
          })
        }
      break

      case 'answer':
        // for ex. UserB answers UserA
        conn = allSockets[data.connectedUser]
        allUsers[user] = false
        if (conn != null) {
          socket.otherName = data.connectedUser
          sendTo(conn, {
            event: 'answer',
            answer: data.answer
          })
        }
      break
      case 'leave':
        console.log('Disconnecting from', data.connectedUser)
        allUsers[socket.name] = true
        allUsers[data.connectedUser] = true
        socket.otherName = null
        if (conn != null) {
          sendTo(conn, {
            event: 'leave'
          })
        }
      break
    }
  });

  socket.on('disconnect', function() {
    if (socket.name) {
      delete allUsers[socket.name]
      delete allSockets[socket.name]
      if (socket.otherName) {
        console.log('Disconnecting from ', socket.otherName)
        const conn = allSockets[socket.otherName]
        allUsers[socket.otherName] = true
        socket.otherName = null
        if (conn != null) {
          sendTo(conn, {
            type: 'leave'
          })
        }
      }
    }
  })
})

function sendTo(connection, message) {
  connection.send(message)
}
