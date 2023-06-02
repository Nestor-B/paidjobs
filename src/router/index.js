import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import { useSession } from '../stores/session'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/file',
            name: 'file',
            component: () => import('../views/FileView.vue')
        },
        {
            path: '/file/:id?',
            name: 'file',
            component: () => import('../views/FileView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/perfil',
            name: 'perfil',
            component: () => import('../views/PerfilView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/history-local',
            name: 'historylocal',
            component: () => import('../views/HistoryNoLogin.vue')
        }
    ]
})

// router.beforeEach((to, from, next) => { 
//     const { isToken } = useSession()
//     if (!isToken && to.name !== 'login' && to.name !== 'register') next({ name: 'login' })
//     else next()
// })

export default router
