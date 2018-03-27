import axios from 'axios'
import router from '@/routes/'

const rootPath = '/api' // 后端 API 根路径
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

const xhr = ({ method = 'get', url, body = null}) => {

  // const queryString = data => {
  //   let str = ''
  //   const body = typeof data === 'object' ? data : {}
  //   Object.keys(body || {}).forEach((key, index) => {
  //     str += (index === 0 ? '?' : '&') + key + '=' + body[key]
  //   })
  //   return str
  // }

  const promise = new Promise((resolve, reject) => {
    // const reqPath = rootPath + url + (method === 'get' ? queryString(body) : '')
    const reqPath = rootPath + url

    axios({
      method: 'post', // 所有请求都用post
      url: reqPath,
      data: body
    }).then(res => {
      console.log('axios === ', res, reqPath)
      const { resultCode, msg } = res.data
      if (resultCode === 3) {
        console.error('not login')
        router.push({ name: 'login' })
      } else if (resultCode) {
        const errorInfo = msg || '请求错误'
        return reject(errorInfo)
      }
      resolve(res.data || {})
    }).catch(err => {
      console.error('request error: %s', err)
      reject('请求失败')
    })
  })

  return promise
}

export default xhr
