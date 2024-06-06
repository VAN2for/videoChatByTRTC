//创建路由器并暴露
import { createRouter,createWebHistory } from "vue-router";
//引入一个个组件
import VideoChat from "../components/VideoChat.vue";
import login from "../components/login.vue"
import Chat from "../components/Chat.vue"
//创建路由器
const router =createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/videoChatByTRTC/',
            component:login
        },
        {
            path:'/videoChatByTRTC/VideoChat',
            component:VideoChat
        },
        {
            path:'/videoChatByTRTC/Chat',
            component:Chat
        }
    ]
})

export default router