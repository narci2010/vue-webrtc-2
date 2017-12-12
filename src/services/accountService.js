import xhr from './xhr/'

/**
 * 账号模块 API
 */
class AccountService {

  /**
   * 登录
   * @param  {String} userData.userName
   * @param  {String} userData.password
   */
  login (userData) {
    return xhr({
      method: 'post',
      url: '/auth/login',
      body: userData
    })
  }

  /**
   * 获取用户图片
   * @param  {String} userId
   */
  getUserImage (userId) {
    return xhr({
      url: '/auth/getUserImage',
      body: { userId }
    })
  }

}

// 实例化后导出，全局单例
export default new AccountService()
