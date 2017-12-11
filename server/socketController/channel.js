class Channel {
  constructor(id, socket, cxt, io) {
    this.socket = socket
    this.id = id
    this.user = null
    this.cxt = cxt
    this.room = null
    this.io = io
  }
  static createChannel(id, socket, cxt, io) {
    return new Channel(id, socket, cxt, io)
  }
  setUser(user) {
    this.user = user
  }
  init() {
    this.socket.on('register-user', (id, name) => {
      this.cxt.createUserById(id, name, this.id)
    })

    this.socket.on('send-message', msg => { /** 发送消息 */
      this.notifyMsg(msg)
      console.log(msg)
      this.cxt.addMsg(msg)
    })

    this.socket.on('close-connection', () => {
      console.log(this.id + '--关闭连接')
      this.cxt.remove(this)
    })

    this.sendUsers()
  }
  notifyMsg(msg) {
    msg.type = 'notify'

    this.io.sockets.emit('receive-message', msg)
  }
  sendUsers() {
  }
}
module.exports = Channel
