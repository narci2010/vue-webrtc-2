const express = require('express')
const router = express.Router()

const nickNameRes = (req, res) => {
  const { allUsers, body: { nickName } } = req

  const response = allUsers[nickName]
    ? {
      resultCode: 1,
      msg: 'Nickname Has Already Exist.'
    }
    : {
      resultCode: 0
    }

  res.status(200).json(response)
}

router.post('/account/login', (req, res) => {
  nickNameRes(req, res)
})

router.post('/account/checkNickname', (req, res) => {
  nickNameRes(req, res)
})

module.exports = router
