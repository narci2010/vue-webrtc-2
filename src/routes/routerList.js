export default [
  {
    path: '/',
    component(resolve) {
      require(['@/views/'], resolve)
    },
    redirect: to => {
      return '/account/login'
    },
    children: [
      {
        path: '/account/login',
        name: 'account.login',
        component(resolve) {
          require(['@/views/account/login'], resolve)
        }
      },
      {
        path: '/account/user-center',
        name: 'account.userCenter',
        component(resolve) {
          require(['@/views/userCenter/'], resolve)
        }
      }
    ]
  }
]
