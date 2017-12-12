const express = require('express')
const router = express.Router()
const accountManagementModel = require('../models/accountManagementModel')

// login
router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(200).json({
      result: 1,
      errorMsg: '登录失败'
    })
  }

  const username = req.body.username.substring(0, 20)
  const password = req.body.password.substring(0, 32)

  accountManagementModel
    .fetchLogin({
      username,
      password
    })
    .then(function(data) {
      res.status(200).json({
        result: 0,
        data: {
          userId: data.userId,
          userImage: data.userImage
        }
      })
    })
    .catch(function(err) {
      console.error(err)
      res.status(200).json({
        result: 1,
        errMsg: '登录失败'
      })
    })
})

router.get('/getUserImage', (req, res) => {
  if (!req.query.userId) {
    return res.status(200).json({
      result: 1,
      errorMsg: '获取失败'
    })
  }

  const userId = req.query.userId.substring(0, 20)

  accountManagementModel
  .getUserImage(userId)
  .then(function(data) {
    res.status(200).json({
      result: 0,
      userImage: data.userImage
    })
  })
  .catch(function(err) {
    console.error(err)
    res.status(200).json({
      result: 1,
      errMsg: '获取失败'
    })
  })
})

module.exports = router
