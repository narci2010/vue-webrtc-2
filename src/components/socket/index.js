import io from 'socket.io-client'
import Context from './context'

let socketUrl = 'http://ashshen.cc:10010/'
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
