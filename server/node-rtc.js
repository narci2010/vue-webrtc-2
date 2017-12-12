var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

// set json header
app.use(function(req, res, next) {
  res.contentType('application/json')
  next()
})

const accountManagementCtrl = require('./rtcController/accountManagementCtrl')
app.use('/auth/', accountManagementCtrl)

app.listen(10000)

module.exports = app
