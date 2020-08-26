import Vue from 'vue'
import App from './App.vue'
import VueRouter from './vueRouter'
// import VueRouter  from 'vue-router'
import About from './about.vue'
import Index from './index.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router =  new VueRouter({
  mode:'hash',
  routes:[
    { name: 'index', path: '/', component: Index},
    { name: 'about', path: '/about', component: About}
  ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
