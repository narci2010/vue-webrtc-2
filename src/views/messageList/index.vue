<template>
  <div class="message-page-section">
    <div class="message-list-section">
      <div
        class="message-item"
        v-for="(msg, index) in messageList"
        :key="index"
        :class="{ 'is-yours': msg.userId === userId }"
      >
        <img
          :src="userImages[msg.userId]"
          class="user-img"
        />
        <div class="message-content">
          <span
            v-for="(content, index) in msg.message.split('\n')"
            :key="index"
          >{{ content }}<br></span>
        </div>
      </div>
    </div>
    <div class="input-section">
      <textarea v-model="message" ref="msgInput" class="textarea"></textarea>
      <button @click="sendMsg" class="send-msg">send</button>
    </div>
  </div>
</template>
<script>
import getCxt from '@/components/socket/'
import * as types from '@/store/types/accountTypes'

export default {
  data() {
    return {
      socketCxt: getCxt(),
      userId: null,
      message: '',
      messageList: JSON.parse(localStorage.messageList || '[]'),
      userImages: JSON.parse(localStorage.userImages || '{}')
    }
  },

  created() {
    if (!localStorage.currentUser) {
      return this.$router.push('/login')
    }

    this.socketCxt
      .createConnection()
      .then(() => {
        const currentUser = JSON.parse(localStorage.currentUser || '{}')

        // this.$Message.success('socket conn success')
        this.userId = currentUser.userId
        this.socketCxt.registerUser(currentUser.userId, currentUser.username)
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
      this.$refs.msgInput.focus()
    },
    receiveMsg(msg) {
      const { userImages } = this
      if (!userImages[msg.userId]) {
        this.$store
          .dispatch(types.GET_USER_IMAGE_REQUEST, msg.userId)
          .then(res => {
            userImages[msg.userId] = res.userImage

            this.userImages = userImages
            localStorage.userImages = JSON.stringify(userImages)

            this.messageList.push(msg)
          })
      } else {
        this.messageList.push(msg)
      }
      localStorage.messageList = JSON.stringify(this.messageList || [])
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

  .message-list-section {
    padding: 10px 10px 0 10px;
  }

  .input-section {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #ddd;
    padding: 10px 0;
    background-color: #fff;

    .textarea {
      width: 100%;
      height: 40px;
      resize: none;
      line-height: 20px;
      padding: 0 100px 0 10px;
      border: none;
      outline: none;
      font-size: 14px;
    }

    .send-msg {
      position: absolute;
      height: 32px;
      top: 14px;
      right: 20px;
      width: 60px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background-color: #fff;
      outline: none;
      font-size: 14px;
    }
    .send-msg:focus, .send-msg:active {
      background-color: #f5f5f5;
      border-color: #ddd;
      box-shadow: none;
    }
  }

  .message-item {
    margin-bottom: 10px;
    word-break: break-all;

    .user-img {
      width: 35px;
      height: 35px;
    }

    .message-content {
      position: relative;
      display: inline-block;
      margin-left: 10px;
      max-width: 60%;
      min-height: 35px;
      vertical-align: top;
      padding: 7px 10px;
      line-height: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .message-content:before {
      content: '';
      position: absolute;
      width: 9px;
      height: 9px;
      border: 1px solid #ddd;
      border-right: none;
      border-top: none;
      left: -5px;
      top: 12px;
      transform: rotate(45deg);
      background-color: #fff;
    }

    &.is-yours {
      color: #2c3e50;
      transform: rotate(180deg);

      .user-img, .message-content {
        transform: rotate(180deg);
      }

      .message-content {
        background-color: #a2e563;
        vertical-align: bottom;
        margin-bottom: 3px;
      }

      .message-content:before {
        left: auto;
        right: -5px;
        transform: rotate(225deg);
        background-color: #a2e563;
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .message-page-section {
    width: 100%;
    height: 100vh;
    margin: 0;
    border: none;
    border-radius: 0;

    .message-list-section {
      padding: 10px 10px 80px 10px;
    }

    .input-section {
      position: fixed;
      bottom: 0;
    }
  }
}
</style>

