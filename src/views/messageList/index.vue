<template>
  <div class="message-page-section">
    <div class="message-list-section">
      <div class="message-item" v-for="(msg, index) in messageList" :key="index">
        {{ msg.name }}:{{ msg.message }}
      </div>
    </div>
    <div class="input-section">
      <textarea v-model="message" class="textarea"></textarea>
      <button @click="sendMsg" class="send-msg">send</button>
    </div>
  </div>
</template>
<script>
import getCxt from '@/components/socket/'

export default {
  data() {
    return {
      socketCxt: getCxt(),
      message: '',
      messageList: []
    }
  },

  created() {
    if (!localStorage.userInfo) {
      return this.$router.push('/login')
    }

    this.socketCxt
      .createConnection()
      .then(() => {
        const userInfo = JSON.parse(localStorage.userInfo || '{}')

        this.$Message.success('socket conn success')
        this.socketCxt.registerUser(userInfo.id, userInfo.username)
        this.socketCxt.receiveMsg(this.receiveMsg)
      })
  },

  methods: {
    sendMsg() {
      const { socketCxt: { userId, name }, message } = this
      if (!message) return false
      this.socketCxt.sendMsg({
        userId,
        name,
        message
      })
      this.message = ''
    },
    receiveMsg(msg) {
      this.messageList.push(msg)
    }
  }
}
</script>
<style lang="scss">
.message-page-section {
  width: 800px;
  margin-left: calc(50% - 400px);
  height: 90vh;
  margin-top: 5vh;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;

  .input-section {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #ddd;
    padding: 10px 0;

    .textarea {
      width: 100%;
      height: 40px;
      resize: none;
      line-height: 20px;
      padding: 0 100px 0 10px;
      border: none;
      outline: none;
    }

    .send-msg {
      position: absolute;
      height: 32px;
      top: 14px;
      right: 20px;
      width: 60px;
      border-radius: 3px;
      background-color: #fff;
      outline: none;
    }
    .send-msg:focus, .send-msg:active {
      background-color: #f5f5f5;
      border-color: #ddd;
      box-shadow: none;
    }
  }
}
</style>

