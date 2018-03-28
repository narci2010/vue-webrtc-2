<template>
  <div class="login-content">
    <div class="login-body">
      <h2 class="title">Enter Your Nickname</h2>
      <input
        type="text"
        class="nick-name-input"
        v-model="nickName"
        ref="nickNameInput"
        maxlength="20"
        @keyup.enter="linkStart"
      />
      <br>
      <el-button
        type="primary"
        class="link-start"
        :class="{ 'link-start-with-animation': nickName }"
        :disabled="!nickName"
        @click="linkStart"
      >LINK START</el-button>
    </div>
    <div class="animation-bg">

    </div>
  </div>
</template>

<script>
export default {

  data () {
    return {
      nickName: ''
    }
  },

  methods: {
    linkStart() {
      const { nickName } = this

      if (!nickName) return false

      this.$XHR({
        url: '/account/login',
        body: { nickName }
      }).then((res) => {
        window.sessionStorage.nickName = nickName

        this.$router.push({ name: 'account.userCenter' })
      }, err => {
        this.$notify.error({
          title: '错误',
          message: err
        })
      })
    }
  },

  mounted () {
    this.$refs.nickNameInput.focus()
  }
}
</script>
<style lang="less" scoped>
.login-content {
  text-align: center;

  .login-body {
    width: 1000px;
    display: inline-block;
    margin-top: 125px;

    .title {
      font-size: 26px;
      line-height: 32px;
      color: #409EFF;
    }

    .nick-name-input {
      width: 280px;
      font-size: 26px;
      margin-top: 10px;
      border: none;
      border-bottom: 1px solid #409EFF;
      outline: none;
      text-align: center;
    }

    .has-code {
      color: #5f5f5f;
      margin-top: 30px;
      text-indent: 180px;
    }

    .link-start {
      margin-top: 40px;
    }

    @keyframes button-animation {
      0% {
        box-shadow: 0px 0px 4px #409eff;
        text-shadow: 0 0 0 #fff;
      }
      50% {
        box-shadow: 0px 0px 22px #409eff;
        text-shadow: 0 0 4px #fff;
      }
      100% {
        box-shadow: 0px 0px 4px #409eff;
        text-shadow: 0 0 0 #fff;
      }
    }

    .link-start-with-animation {
      animation: button-animation 2s infinite linear;
    }
  }
}
</style>

