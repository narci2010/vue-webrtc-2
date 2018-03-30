<template>
  <div>
    <!-- <router-view transition="fade" transition-mode="out-in"></router-view> -->
    <video
      class="video"
      ref="videoTag"
      autoplay
      playsinline
      webkit-playsinline="true"
      x5-video-player-type="h5"
    ></video>
    <video
      class="video"
      ref="videoTag2"
      autoplay
      playsinline
      webkit-playsinline="true"
      x5-video-player-type="h5"
    ></video>
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

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia
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
      const { video, audio } = this
      const { videoTag, videoTag2 } = this.$refs

      peerConn = new RTCPeerConnection(configuration)

      navigator.getUserMedia({
        video,
        audio
      }, stream => {
        if ('srcObject' in videoTag) {
          videoTag.srcObject = stream
        } else {
          videoTag.src = window.URL.createObjectURL(stream)
        }

        videoTag.volume = 0

        stream.getTracks().forEach(track => {
          peerConn.addTrack(track, stream)
        })
      }, err => {
        console.log('error: ', err)
      })

      peerConn.ontrack = e => {
        if ('srcObject' in videoTag) {
          videoTag2.srcObject = e.streams[0]
        } else {
          videoTag2.src = window.URL.createObjectURL(e.streams[0])
        }
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
  },

  created() {
    this.socket.on('message', data => {
      switch (data.event) {
        case 'newUserIn':
          this.connectedUser = data.name

          console.log('new user in, user name', data.name)

          peerConn.createOffer(offer => {
            console.log('send offer to', this.connectedUser)
            this.socket.send({
              event: 'offer',
              offer,
              connectedUser: this.connectedUser
            })
            peerConn.setLocalDescription(offer)
          }, error => {
            console.log('Error when creating an offer', error)
          })
        break

        case 'offer':
          console.log('got offer from', data.name)
          peerConn.setRemoteDescription(new RTCSessionDescription(data.offer))
          // create an answer to an offer
          this.connectedUser = data.name
          peerConn.createAnswer(answer => {
            console.log('send answer to', data.name)
            this.socket.send({
              event: 'answer',
              answer,
              connectedUser: this.connectedUser
            })
            peerConn.setLocalDescription(answer)
          }, error => {
              console.log('Error when creating an answer', error)
          })
        break

        case 'answer':
          console.log('got answer from', this.connectedUser)
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
  width: 49%;
  border: 1px solid #ddd;
  vertical-align: top;
}

@media screen and (max-width: 800px) {
  .video {
    margin: 0 0 100px 25%;
    display: block;
  }
}
</style>
