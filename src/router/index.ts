import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: '/host',
          name: 'host',
          component: () => import('@/views/host/HostIndexView.vue')
        },
        {
          path: '/health',
          name: 'health',
          component: () => import('@/views/health/HealthIndexView.vue')
        },
        {
          path: '/setting',
          name: 'setting',
        },
        {
          path: '/schedule/list',
          name: 'scheduleList',
          component: () => import('@/views/schedule/ScheduleView.vue')
        },
        {
          path: '/schedule/record',
          name: 'scheduleRecord',
          component: () => import('@/views/schedule/ScheduleRecordView.vue')
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

export default router
