import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    name: username,
    password
  }
  return request({
    url: 'http://admin.base.com/api/admin/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

