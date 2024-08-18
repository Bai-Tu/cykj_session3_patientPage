// 引入路由模块
import VueRouter from "vue-router";
// 引入Vue
import Vue from "vue";

import { getToken } from "@/utils/authToken";
import store from "@/store";

// 给Vue挂载路由模块
Vue.use(VueRouter)

var routes = [
    {
        name:"/",
        path:"/",
        component:()=>import("../views/MainView"),
        children:[]
    },
    {
        name:"main",
        path:"/main",
        component:()=>import("../views/MainView"),
        children:[]
    },
    {
        name:"login",
        path:"/login",
        component:()=>import("../views/LoginView"),
        children:[]
    },
    {
        name:"patient",
        path:"/patient",
        component:()=>import("../views/PatientView"),
        children:[]
    }
    
]

var router = new VueRouter({
    mode:"hash",
    routes
})

// 全局路由守卫
router.beforeEach((to,from,next)=>{
    var whiteList = ["/login", '/']
    var index = whiteList.indexOf(to.path)

    if (index == -1) {
        if (!getToken()) {
            alert("请先登录")
            if (from.path != to.path) {
                router.push({
                    path: "/login?redirect=" + to.path
                })
            }
        } else {
            if(store.state.admin.adminId == undefined){
                store.dispatch("getAdminInfo").then(res=>{
                    if(res){
                        next()
                    }else{
                        alert("router有问题")
                    }
                });
            }else{
                next()
            }
        }
    } else {
        next()
    }
})

export default router;
