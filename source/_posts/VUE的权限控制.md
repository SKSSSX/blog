---
title: VUE的权限控制
date: 2018-08-22 15:17:06
categories:
- VUE
tags:
- vue
- permission
---

## 概述
{% blockquote %}
如果VUE权限控制问题困扰着你，那么这篇文章将拯救你。关于VUE的前台路由控制和视图控制是大家最需要的前端技术解决方案。
{% endblockquote %}
### Vue-Access-Control
{% blockquote %}
本解决方案是基于 {% link Vue-Access-Control https://refined-x.com/2017/11/28/Vue2.0用户权限控制解决方案/ [external] [title] %} 进行改造的，深度剖析了里面的路由控制和视图控制（资源控制还是后台做比较靠谱）
{% endblockquote %}
## 心路历程
{% blockquote %}
1. 权限数据由后台接口获得（权限树），但是前端不能贸然存储到本地浏览器里（localStorage、sessionStorage、Cookie等），如果被恶意篡改，麻烦可就大了!!!!!
2. 想要用 VUEX （状态管理模式）来存储，但是网页一刷新，就会被重置成空，所以我推断 VUEX 适合用在 “无刷新” 的 APP 中；再者，权限树这么复杂的结构，并不是 VUEX 所实现的 “共享状态” 模式，只是单一的对每个页面（路由控制）、按钮（视图控制）、接口（请求控制）
3. 针对实际的应用场景，请求控制，就是某个角色是否有调用某个接口的权限，这种后台会做权限控制的，没有权限会给你报401的，只有“路由控制”和“视图控制”是前端人员需要去解决的。
4. 对于 Vue-Access-Control 这套权限解决方案貌似也有不完美之处，不能贴合实际的开发需要，需要稍作调整，比如路由嵌套两层还是可以使用的，要是三层及其以上就得修改递归的函数了。
{% endblockquote %}
<!-- more --> 
## 实现原理
{% blockquote %}
详见{% link Vue-Access-Control https://refined-x.com/2017/11/28/Vue2.0用户权限控制解决方案/ [external] [title] %}
{% endblockquote %}

### 具体实现
{% codeblock App.vue lang:html %}
<template>
    <div id="app" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
import Vue from 'vue'
import {getBankAuth} from '@/api/auth'
import userPath from '@/router/fullpath'
import * as util from '@/utils/util.js'
export default {
    name: 'App',
    data () {
        return {
            menuData: null, // 导航树
            userAuth: null // 接口返回权限数据
        }
    },
    methods: {
        getRoutes (userAuth) {
            if (!userAuth[0].children) {
                return console.warn(userAuth)
            }
            let allowedRouter = []
            // 将菜单数据转成多维数组格式
            let arrayMenus = util.buildMenu(userAuth[0].children)
            // 将多维数组转成对象格式
            let hashMenus = {}
            hashMenus = util.getPath(arrayMenus)
            // 全局挂载hashMenus，用于实现路由守卫
            this.$root.hashMenus = hashMenus
            // 筛选本地路由方法
            let findLocalRoute = function (array, base) {
                let replyResult = []
                array.forEach(function (route) {
                    let pathKey = (base ? base + '/' : '') + route.path
                    if (hashMenus.hasOwnProperty(pathKey)) {
                        if (Object.prototype.toString.call(route.children) === '[object Array]') {
                            route.children = findLocalRoute(route.children, pathKey)
                        }
                        replyResult.push(route)
                    }
                })
                if (base) {
                    return replyResult
                } else {
                    allowedRouter = allowedRouter.concat(replyResult)
                }
            }
            let originPath = util.deepcopy(userPath)
            findLocalRoute(originPath)
            return allowedRouter
        },
        extendRoutes (allowedRouter) {
            let vm = this
            let actualRouter = util.deepcopy(allowedRouter)
            actualRouter.map(e => {
                // 复制子菜单信息到meta用于实现导航相关效果，非必需
                if (e.children) {
                    if (!e.meta) e.meta = {}
                    e.meta.children = e.children
                }
                // 为动态路由添加独享守卫
                return e.beforeEnter = function (to, from, next) {
                    if (vm.$root.hashMenus[to.path]) {
                        next()
                        // 按钮权限检验方法
                        Vue.prototype.$_has = function (p) {
                            let permission = false
                            // 校验权限
                            this.hashButtons.forEach(item => {
                                if (item.hasOwnProperty(to.path)) {
                                    if (item[to.path].indexOf(p) !== -1) {
                                        permission = true
                                    }
                                }
                            })
                            return permission
                        }
                    } else {
                        next('/401')
                    }
                }
            })
            // let originPath = util.deepcopy(userPath)
            let originPath = actualRouter
            // 注入路由
            vm.$router.addRoutes(originPath.concat([{
                path: '*',
                redirect: '/login'
            }]))
        },
        // 获取权限数据
        getAuthority (role) {
            let vm = this
            // 检查登录状态
            let localUser = util.session('token')
            if (!localUser || !localUser.authorities) {
                return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } })
            }
            if (role === 'bank') {
                getBankAuth().then(data => {
                    let userAuth = data
                    // 获得实际路由
                    let allowedRouter = vm.getRoutes(userAuth)
                    // 若无可用路由限制访问
                    if (!allowedRouter || !allowedRouter.length) {
                        util.session('token', '')
                        return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>')
                    }
                    // 动态注入路由
                    vm.extendRoutes(allowedRouter)
                    // 保存数据用作他处，非必需
                    vm.menuData = allowedRouter
                    vm.userAuth = userAuth
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    },
    created () {
        this.getAuthority('bank')
    }
}
</script>

<style lang="scss">
    @import 'assets/sass/sks.scss';
    @import 'assets/fonts/iconfont.css';/*阿里字体图标*/
    @import 'assets/sass/table.scss';/*table样式*/
    @import 'assets/sass/dialog.scss'; /* dialog样式 */
    .app-main {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>
{% endcodeblock %}

## 代码剖析
{% codeblock Layout.vue lang:javascript %}
export default {
    name: 'layout',
    created () {
        this.getNav()
    },
    methods: {
        getNav () {
            // 设置导航
            let menus = this.$parent.menuData
            if (!localStorage.navBankArray) {
                if (menus) {
                    // 整理导航数据结构
                    menus.forEach((item, index) => {
                        if (index === 0) {
                            menus[index].active = true
                        } else {
                            menus[index].active = false
                        }
                    })
                    this.routerMap = menus
                    localStorage.navBankArray = JSON.stringify(menus)
                }
            } else {
                let tempBankArray = JSON.parse(localStorage.navBankArray)
                this.routerMap = tempBankArray
            }
        },
        logout () {
            // 清除session
            util.session('token', '')
            // 清除菜单权限
            this.$root.hashMenus = {}
            // 退出登录
            logoutBank()
                .then(res => {
                    store.commit('logout', this)
                    this.$router.replace({name: 'Login'})
                    localStorage.removeItem('navBankArray')
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    watch: {
        $route () {
            this.getNav()
        }
    }
}
{% endcodeblock %}

