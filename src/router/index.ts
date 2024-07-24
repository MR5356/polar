import { createRouter, createWebHistory } from 'vue-router'
import { useSystemStore } from '@/stores/system'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: () => import('../layouts/framework/FrameworkLayout.vue'),
      component: () => import('../layouts/TabbedFramework/TabbedFrameworkLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          redirect: '/dashboard'
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: '/application',
          name: 'application',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/application/ApplicationView.vue')
        },
        {
          path: '/host',
          name: 'host',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/host/HostIndexView.vue')
        },
        {
          path: '/container/:id/:driver',
          name: 'container',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/host/ContainerView.vue')
        },
        {
          path: '/health',
          name: 'health',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/health/HealthIndexView.vue')
        },
        {
          path: '/setting',
          name: 'setting',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/TestView.vue')
        },
        {
          path: '/schedule/list',
          name: 'scheduleList',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/schedule/ScheduleView.vue')
        },
        {
          path: '/schedule/record',
          name: 'scheduleRecord',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/schedule/ScheduleRecordView.vue')
        },
        {
          path: '/script/list',
          name: 'scriptList',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/script/ScriptListView.vue')
        },
        {
          path: '/script/record',
          name: 'scriptRecord',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/script/ScriptRecordView.vue')
        },
        {
          path: '/pipeline',
          name: 'pipeline',
          children: [
            {
              path: '',
              name: 'pipelineList',
              component: () => import('@/views/pipeline/PipelineListView.vue')
            },
            {
              path: 'new',
              name: 'pipelineNew',
              component: () => import('@/views/pipeline/PipelineNewView.vue')
            },
            {
              path: ':id',
              name: 'pipelineDetail',
              component: () => import('@/views/pipeline/PipelineDetailView.vue')
            }
          ]
        },
        {
          path: '/notification',
          name: 'notification',
          meta: {
            tabbed: true
          },
        },
        {
          path: '/user',
          name: 'user',
          meta: {
            tabbed: true
          },
          component: () => import('@/views/user/UserView.vue')
        },
      ]
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: () => import('@/views/terminal/TerminalView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const systemStore = useSystemStore()

  if (to.meta.tabbed) {
    systemStore.addTab({
      title: to.name as string,
      key: to.path,
    })
  }
  next()
})

export default router
