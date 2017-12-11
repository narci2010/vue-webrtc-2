
class Context {
  constructor(url, io) {
    this.url = url
    this.io = io
    this.socket = null
    this.userId = 1
    this.name = ''
  }
  createConnection(callback) {
    let socket = this.io.connect(this.url)
    this.socket = socket
    return new Promise((resolve, reject) => {
      socket.on('connect-success', () => {
        resolve({})
      })
    })
  }
  registerUser(id, name) {
    this.userId = id
    this.name = name
    this.socket.emit('register-user', this.userId, this.name)
  }
  newUser(callback) {
    this.socket.on('new-user', callback)
  }
  sendMsg(msg) {
    this.socket.emit('send-message', msg)
  }
  receiveMsg(callback) {
    this.socket.on('receive-message', function(msg) {
      callback(msg)
    })
  }
  closeConnection() {
    this.socket.emit('close-connection')
  }
}
export default Context
