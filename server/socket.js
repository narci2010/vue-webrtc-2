const app = require('http').createServer()
const io = require('socket.io')(app)
const cxt = require('./socketController')

app.listen(10010)

let channelId = 1

io.on('connection', socket => {
  socket.emit('connect-success', '')
  cxt.createChannel(channelId++, socket, io)
})


