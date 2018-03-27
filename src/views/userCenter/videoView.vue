<template>
  <div>
    <!-- <router-view transition="fade" transition-mode="out-in"></router-view> -->
    <video class="video" ref="videoTag" autoplay></video>
    <video class="video" ref="videoTag2" autoplay></video>
  </div>
</template>
<script>
let peerConn = null
// let connectedUser = null
const configuration = {
  iceServers: [
    {
      url: 'turn:ashshen.cc:3478',
      credential: 'ashshen',
      username: '54haotiange'
    }
  ]
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription

export default {

  props: {
    socket: Object
  },

  data() {

    return {
      video: true,
      audio: true,
      localVideo: null,
      connectedUser: ''
    }
  },

  methods: {
    startVideo() {
      console.log(111)
      const { video, audio } = this
      const { videoTag, videoTag2 } = this.$refs

      peerConn = new RTCPeerConnection(configuration)

      navigator.getUserMedia({
        video,
        audio
      }, stream => {
        videoTag.srcObject = stream
        videoTag.volume = 0

        peerConn.addStream(stream)
      }, err => {
        console.log('error: ', err)
      })

      peerConn.onaddstream = e => {
        videoTag2.srcObject = e.stream
      }

      peerConn.onicecandidate = event => {
          console.log(event.target.iceGatheringState)
          setTimeout(() => {
            if (event.candidate) {
              this.socket.send({
                event: 'candidate',
                candidate: event.candidate,
                connectedUser: this.connectedUser
              })
            }
          })
        }
    }
  },

  mounted() {
    this.startVideo()
    this.socket.on('message', data => {
      switch (data.event) {
        case 'newUserIn':
          this.connectedUser = data.name

          console.log('new user in, send offer!')

          peerConn.createOffer(offer => {
            this.socket.send({
              event: 'offer',
              offer: offer,
              connectedUser: this.connectedUser
            })
            peerConn.setLocalDescription(offer)
          }, error => {
            console.log('Error when creating an offer', error)
          })
        break

        case 'offer':
          console.log('got offer!')
          peerConn.setRemoteDescription(new RTCSessionDescription(data.offer))
          // create an answer to an offer
          this.connectedUser = data.name
          peerConn.createAnswer(answer => {
            peerConn.setLocalDescription(answer)
            console.log('send answer!')
            this.socket.send({
              event: 'answer',
              answer: answer,
              connectedUser: this.connectedUser
            })
          }, error => {
              console.log('Error when creating an answer', error)
          })
        break

        case 'answer':
          console.log('got answer!')
          peerConn.setRemoteDescription(new RTCSessionDescription(data.answer))
        break

        case 'candidate':
          peerConn.addIceCandidate(new RTCIceCandidate(data.candidate))
        break
      }
    })
  }
}
</script>

<style lang="less" scoped>
.video {
  width: 400px;
  height: 225px;
}
</style>
