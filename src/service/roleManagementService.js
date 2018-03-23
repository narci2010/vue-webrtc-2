import xhr from './xhr/'

class RoleManagementService {

  roleManagementList(body) {
    return xhr({
      method: 'post',
      url: '/cms/content/getList',
      body
    })
  }

}

// 实例化后导出，全局单例
export default new RoleManagementService()
