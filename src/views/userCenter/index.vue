<template>
  <div class="user-center">
    <div class="user-center-main">
      <p>Welcome，{{nickName}}</p>
      <p @click="newRoomCode">生成房间邀请码！</p>
    </div>
    <video-view
      v-if="roomCode"
      :socket="socket"
    ></video-view>
  </div>
</template>
<script>
const socket = io.connect('https://ashshen.cc:5567/')
// const socket = io.connect('https://192.168.26.157:445/')
import crypto from 'crypto'
import VideoView from './videoView'

export default {

  components: { VideoView },

  data() {
    return {
      socket,
      nickName: window.sessionStorage.nickName,
      roomCode: ''
    }
  },

  methods: {
    md5 (password) {
      const md5 = crypto.createHash('md5')
      md5.update(password)
      return md5.digest('hex')
    },

    newRoomCode() {
      const { nickName, send } = this
      const roomCode = this.md5(nickName + new Date().valueOf())

      send({
        event: 'enterRoom',
        roomCode,
        name: nickName
      })
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

    send({
      event: 'join',
      name: nickName
    })

    socket.on('message', data => {
      switch (data.event) {
        case 'join':
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: '该昵称已被占用'
            })

            window.sessionStorage.nickName = ''
            this.$router.push({ name: 'account.login' })
          }
        break
        case 'enterRoom':
          if (data.success) {
            this.$notify.success({
              title: '成功',
              message: data.message
            })
            this.roomCode = data.roomCode
          } else {
            this.$notify.error({
              title: '错误',
              message: data.message
            })
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
