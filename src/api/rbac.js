import request from '@/utils/request'

export function SyncMenuPermissionData(params) {
  // return request({
  //   url: 'http://admin.base.com/api/permission',
  //   method: 'post',
  //   data: params
  // })
  return request.post('http://admin.base.com/api/permission', params)
}

export function getMenuPermissionData() {
  return request.get('http://admin.base.com/api/permission')
}

export function deletePermission(id) {
  return request.delete(`http://admin.base.com/api/permission/${id}`)
}

export function assignRolePermissions(roleid, permissionList) {
  return request.post(`http://admin.base.com/api/role/${roleid}/permission`, { 'permissionList': permissionList })
}

export function getRolePermissions(roleid) {
  return request.get(`http://admin.base.com/api/role/${roleid}/permission`)
}

export function getRoleButtons(roleid) {
  return request.get(`http://admin.base.com/api/role/${roleid}/button`)
}

export function getButtons() {
  return request.get(`http://admin.base.com/api/button`)
}
