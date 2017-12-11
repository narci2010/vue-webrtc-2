import io from 'socket.io-client'
import Context from './context'

let socketUrl = 'http://192.168.25.20:10010/'
let cxt = null

export default function getCxt() {
  if (cxt == null) {
    cxt = new Context(socketUrl, io)
  }
  return cxt
}

export {
  getCxt
}
