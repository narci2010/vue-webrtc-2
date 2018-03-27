<template>
  <div class="app-section">
    <router-view transition="fade" transition-mode="out-in"></router-view>
  </div>
</template>
<script>

export default {

  created() {
    const { nickName } = window.sessionStorage

    if (nickName) {
      this.$XHR({
        url: '/account/checkNickname',
        body: { nickName }
      }).then(() => {
        this.$router.push({ name: 'account.userCenter' })
      }, err => {
        this.$notify.error({
          title: '错误',
          message: err
        })

        this.$router.push({ name: 'account.login' })
        window.sessionStorage.nickName = ''
      })
    } else {
      this.$router.push({ name: 'account.login' })
    }
  }
}
</script>
