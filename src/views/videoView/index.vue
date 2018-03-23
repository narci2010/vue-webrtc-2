<template>
  <div class="account-section">
    <!-- <router-view transition="fade" transition-mode="out-in"></router-view> -->
    <video class="video" ref="videoTag" autoplay></video>
    <video class="video" ref="videoTag2" autoplay></video>
    <button @click="changeVideoType('audio')">麦克风{{ audio ? '打开' : '关闭'}}</button>
    <button @click="changeVideoType('video')">视频{{ video ? '打开' : '关闭'}}</button>
  </div>
</template>
<script>
// const socket = io.connect('http://192.168.26.157/:12345')
let peerConn = null
// let connectedUser = null
const configuration = {
  iceServers: [
    {
      url: 'turn:115.28.170.217:3478',
      credential: 'zmecust',
      username: 'zmecust'
    }
  ]
}

export default {

  data() {
    const { navigator } = window

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription

    return {
      video: true,
      audio: true,
      localVideo: null
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
        videoTag.srcObject = stream

        peerConn.addStream(stream)
      }, err => {
        console.log('error: ', err)
      })

      peerConn.onaddstream = function(e) {
        videoTag2.srcObject = e.stream
      }

      peerConn.onicecandidate = function (event) {
        console.log(111111111)
          console.log(event.target.iceGatheringState)
          setTimeout(() => {
            if (event.candidate) {
              console.log(111111)
            }
          })
        }
    },

    changeVideoType(type) {
      this[type] = !this[type]
      this.startVideo()
    }
  },

  mounted() {
    this.startVideo()
  }
}
</script>

<style lang="less" scoped>
.video {
  width: 400px;
  height: 225px;
}
</style>
