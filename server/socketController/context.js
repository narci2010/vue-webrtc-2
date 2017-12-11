const Channel = require('./channel')
const _ = require('lodash')

class Context {
  constructor () {
    this.msg = []
    this.room = []
    this.users = []
    this.channels = []
  }
  createChannel (id, socket, io) {
    let channel = new Channel(id, socket, this, io)
    channel.init()
    channel.index = this.channels.length
    this.channels.push(channel)
  }
  createUser (user, channelId) {
    user.index = this.users.length
    this.users.push(user)
    this.channels.find(x => x.id === channelId).setUser(user)
  }
  createUserById (id, name, channelId) {
    let user = { id }
    user.name = name
    this.createUser(user, channelId)
  }
  addMsg (msg) {
    this.msg.push(msg)
  }
  remove (channel) {
    const index = _.findIndex(this.channels, { id: channel.id })
    this.channels.splice(index, 1)
  }
}

module.exports = Context
