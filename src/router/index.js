import { createRouter, createWebHistory } from 'vue-router'
import AboutUs from '../component/about_us.vue'
import About from '../component/about.vue'
import Comments from '../component/comments.vue'
import Detail from '../component/detail.vue'
import ErrorNetwork from '../component/error_network.vue'
import Exhibition from '../component/exhibition.vue'
import ForgotPassword from '../component/forgot_password.vue'
import History from '../component/history.vue'
import Home from '../component/index.vue'
import Login from '../component/login.vue'
import Member from '../component/member.vue'
import MyCollection from '../component/my_collection.vue'
import Register from '../component/register.vue'
import ResetPassword from '../component/reset_password.vue'



const routes = [
    {
path:'/AboutUs',
name:'AboutUs',
component:AboutUs
    },
        {
path:'/About',
name:'About',
component:About
    },
        {
path:'/Comments',
name:'Comments',
component:Comments
    },
        {
path:'/Detail',
name:'Detail',
component:Detail
    },
        {
path:'/ErrorNetwork',
name:'ErrorNetwork',
component:ErrorNetwork
    },
        {
path:'/Exhibition',
name:'Exhibition',
component:Exhibition
    },
        {
path:'/ForgotPassword',
name:'ForgotPassword',
component:ForgotPassword
    },
        {
path:'/History',
name:'History',
component:History
    },
        {
path:'/Home',
name:'Home',
component:Home
    },
        {
path:'/Login',
name:'Login',
component:Login
    },
        {
path:'/Member',
name:'Member',
component:Member
    },
        {
path:'/MyCollection',
name:'MyCollection',
component:MyCollection
    },
        {
path:'/',
name:'Register',
component:Register
    },
        {
path:'/ResetPassword',
name:'ResetPassword',
component:ResetPassword
    }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
