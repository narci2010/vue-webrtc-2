<template>
  <div class="user-center">
    <div class="user-center-main">
      <p>Welcome，{{nickName}}</p>
      <p>您可以：</p>
      <p>
        <el-button
          type="primary"
          :disabled="!nickName"
          @click="newRoomCode"
        >生成房间邀请码</el-button>
        或者
        <el-button
          type="primary"
          :disabled="!nickName"
          @click="showInput"
        >填写邀请码</el-button>
        <el-input
          v-model="roomNum"
          placeholder="请输入32位邀请码"
          :maxlength="32"
          v-show="showRoomInput"
          ref="show-room-input"
          class="room-code-input"
        ></el-input>
        <el-button
          type="primary"
          :disabled="!nickName"
          @click="confirmJoin"
        >确定</el-button>
      </p>
      <p v-show="roomCode">当前所在房间邀请码为：{{ roomCode }}</p>
      <input type="file" accept="video/*;capture=camcorder" style="display: none;" >
      <input type="file" accept="audio/*;capture=microphone" style="display: none;" >
    </div>
    <video-view
      :socket="socket"
      :user-type="userType"
    ></video-view>
  </div>
</template>
<script>
const socket = io.connect('https://ashshen.cc:5566/')
// const socket = io.connect('https://192.168.99.235/')
import crypto from 'crypto'
import VideoView from './videoView'

export default {

  components: { VideoView },

  data() {
    return {
      socket,
      nickName: window.sessionStorage.nickName,
      roomCode: '',
      roomNum: '',
      showRoomInput: false,
      userType: 'creater'
    }
  },

  methods: {
    md5 (password) {
      const md5 = crypto.createHash('md5')
      md5.update(password)
      return md5.digest('hex')
    },

    newRoomCode() {
      this.roomCode = ''

      const { nickName, send } = this
      const roomCode = this.md5(nickName + new Date().valueOf())

      send({
        event: 'enterRoom',
        roomCode,
        name: nickName,
        type: 'create'
      })
      this.userType = 'creater'
    },

    send(message, so = socket) {
      if (message) {
        so.send(message)
      }
    },

    showInput() {
      this.showRoomInput = true
      this.$nextTick(() => {
        this.$refs['show-room-input'].focus()
      })
    },

    confirmJoin() {
      const { nickName, roomNum, send } = this

      if (roomNum.length !== 32) {
        this.$notify.error({
          title: '错误',
          message: '邀请码为32位'
        })
      } else {
        this.userType = 'join'
        send({
          event: 'enterRoom',
          roomCode: roomNum,
          name: nickName,
          type: 'join'
        })
      }
    }
  },

  mounted() {
    const { nickName, send } = this

    if (!nickName) return this.$router.push({ name: 'account.login' })

    setTimeout(() => {
      send({
        event: 'join',
        name: nickName
      })
    }, 500)

    socket.on('message', data => {
      switch (data.event) {
        case 'join':
          if (!data.success) {
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
            this.showRoomInput = false
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

  .user-center-main {
    margin: 20px;
  }

  .room-code-input {
    width: 300px;
  }
}
</style>
