/* Router Modules */

/* Layout */
import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/permission2',
    component: Layout,
    redirect: '/permission2/list',
    name: 'Permission',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/permission/list'),
        name: 'PermissionList',
        meta: { title: 'PermissionList', icon: 'edit' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'Example',
    meta: {
      title: 'role',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/role/create'),
        name: 'createRole',
        meta: { title: 'createRole', icon: 'edit' },
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/role/edit'),
        name: 'editRole',
        meta: { title: 'editRole', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/role/list'),
        name: 'roleList',
        meta: { title: 'roleList', icon: 'list' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
