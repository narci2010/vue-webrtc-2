export default [
  {
    path: '/',
    component (resolve) {
      require(['@/views/account/'], resolve)
    },
    redirect: to => {
      return '/login'
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component (resolve) {
          require(['@/views/account/login'], resolve)
        }
      }
    ]
  },
  {
    path: '/',
    component (resolve) {
      require(['@/views/'], resolve)
    },
    children: [
      {
        path: '/message-list',
        name: 'message-list',
        component (resolve) {
          require(['@/views/messageList/'], resolve)
        }
      }
    ]
  }
]
