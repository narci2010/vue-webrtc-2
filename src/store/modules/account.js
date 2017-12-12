import * as types from '../types/accountTypes'
import accountService from '@/services/accountService'
import md5 from 'crypto-js/md5'

// initial state
const state = {
}

// getters
const getters = {
}

const dealData = function(formData) {
  const obj = Object.assign({}, formData)
  obj.password = md5(obj.password).toString()
  return obj
}


// actions
const actions = {
  [types.LOGIN_REQUEST]({ commit, state }, userData) {
    return accountService.login(dealData(userData))
  },
  [types.GET_USER_IMAGE_REQUEST]({ commit, state }, userId) {
    return accountService.getUserImage(userId)
  }
}

// mutations
const mutations = {
  // [types.CHANGE_USER_IMAGES](state, { userImage, userId }) {
  //   const { userImages } = state

  //   userImages[userId] = userImage
  //   localStorage.userImages = JSON.stringify(userImages)

  //   state.userImages = userImages
  // }
}

export default {
  state,
  getters,
  actions,
  mutations
}
