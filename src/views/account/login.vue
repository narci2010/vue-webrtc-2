<template>
  <div class="login-content">
    <div class="login-form">
      <input
        class="form-input"
        type="text"
        v-model="formData.username"
        placeholder="Username"
        maxlength="20"
      />
      <input
        class="form-input"
        type="password"
        v-model="formData.password"
        placeholder="Password"
        maxlength="20"
      />
      <button
        class="form-btn"
        @click="login"
        :disabled="!formData.username || !formData.password"
      >login</button>
    </div>
  </div>
</template>
<script>
export default {
  data: () =>({
    formData: {
      id: new Date().getTime(),
      username: '',
      password: ''
    }
  }),

  methods: {
    login() {
      const { username, password } = this.formData
      if (!username || !password) {
        return this.$Message.error('请输入用户名和密码')
      }
      localStorage.userInfo = JSON.stringify(this.formData)
      this.$router.push('/message-list')
    }
  },

  created() {
    if (localStorage.userInfo) {
      this.$router.push('/message-list')
    }
  }
}
</script>
<style lang="scss">
.login-content {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #342c3d;
  background-image: url('../../assets/images/background.png');
  background-size: cover;
  background-position-y: bottom;
  background-repeat: no-repeat;

  .login-form {
    width: 341px;
    border-radius: 10px;
    position: absolute;
    z-index: 100;
    display: inline-block;
    top: 50%;
    margin-top: -162.5px;
    right: 50%;
    margin-right: -170.5px;

    .form-input {
      display: inline-block;
      width: 80%;
      height: 44px;
      padding: 0 20px;
      margin-left: 10%;
      margin-bottom: 30px;
      border: none;
      outline: none;
      color: #fff;
      border-radius: 4px;
      background: none;
      border: 1px solid hsla(0,0%,100%,.27);
      text-align: center;
    }

    .form-input:first-child {
      margin-top: 30px;
    }

    .form-btn {
      width: 80%;
      margin-left: 10%;
      margin-bottom: 30px;
      height: 44px;
      color: #fff;
      font-size: 18px;
      background-color: #ea9463;
      border: none;
      border-radius: 5px;
    }
  }
}
</style>

