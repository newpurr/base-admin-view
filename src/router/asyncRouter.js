/* Router Modules */

/* Layout */
import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: 'permission',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },
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
  { path: '*', redirect: '/404', hidden: true }
]
