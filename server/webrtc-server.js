const express = require('express')
const app = express()
const http = require('http')
const IO = require('socket.io')

const server = http.createServer(app).listen(12345)

const io = IO(server)

// 所有用户
const allUsers = {}
// 所有客户端
const allSockets = {}

const roomList = {}

io.on('connect', function (socket) {
  let user = ''
  let room = ''
  let conn = ''

  socket.on('message', function(data) {

    switch (data.event) {
      // 新用户加入
      case 'newMember':
        user = data.name
        // 昵称重复
        if (allUsers[user]) {
          sendTo(socket, {
            event: 'newMember',
            message: '该用户名已存在',
            success: false
          })
        } else {
          allUsers[user] = true
          socket.name = user
          socket.users = []
          allSockets[user] = socket
          Object.keys(allUsers).forEach(item => {
            if (allUsers[item] && item !== user) {
              conn = allSockets[item]
              socket.otherName = item

              sendTo(conn, {
                event: 'newMemberIn',
                userName: user
              })
            }
          })
        }
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
