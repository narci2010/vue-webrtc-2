<template>
  <div class="user-center">
    <div class="user-center-main">
      <p>Welcome，{{nickName}}</p>
      <p @click="newRoomCode">生成房间邀请码！</p>
    </div>
    <video-view
      :socket="socket"
      :room="room"
      :user="nickName"
      :room-members="roomMembers"
    ></video-view>
  </div>
</template>
<script>
const socket = io.connect('https://ashshen.cc:5567/')
import crypto from 'crypto'
import VideoView from './videoView'

export default {

  components: { VideoView },

  data() {
    return {
      socket,
      nickName: window.localStorage.nickName || '',
      inviteCode: '',
      room: '',
      roomMembers: []
    }
  },

  methods: {
    md5 (password) {
      const md5 = crypto.createHash('md5')
      md5.update(password)
      return md5.digest('hex')
    },

    newRoomCode() {
    },

    send(message, so = socket) {
      if (message) {
        so.send(message)
      }
    }
  },

  mounted() {
    const { nickName, send } = this

    if (!nickName) return this.$router.push({ name: 'account.login' })

    setTimeout(() => {
      send({ event: 'newMember', name: nickName })
    }, 3000)

    socket.on('message', data => {
      switch (data.event) {
        case 'newMember':
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.message
            })
            this.$router.push({ name: 'account.login' })
          }
        break
      }
    })

  }
}
</script>

<style lang="less" scoped>
.user-center {
  text-align: center;

  .user-center-main {
    display: inline-block;
    text-align: left;
    margin-top: 120px;
    width: 1000px;
  }
}
</style>
