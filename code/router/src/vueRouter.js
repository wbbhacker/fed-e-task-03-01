let _Vue = null;
export default class VueRouter{

  static install(vue){

    // 判断是否之心install
    if(VueRouter.install.installed){
      return
    }

    VueRouter.install.installed = true

    _Vue = vue
    // 把创建Vue实例的时候传入router注入到Vue 实例上
    _Vue.mixin({
      beforeCreate(){
        if (this.$options.router){
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
          
          switch (this.$options.router.mode) {
            case 'history':
              this.$options.router.data.current = window.location.pathname
              break;
            case 'hash':
              this.$options.router.data.current = window.location.hash.replace('#', '')
              break;
            default:
              break;
          }
        }
      }
    })

  }
  constructor(options){
    this.options = options
    this.routeMap = {};
    this.data = _Vue.observable({
      current:'/'
    })
    this.mode = this.options.mode
  }
  init(){
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }
  initEvent(){
    this.mode
    if(this.mode === 'history'){
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    }
    if(this.mode === 'hash'){
      window.addEventListener('hashchange', () => {
        this.data.current = window.location.hash.replace('#', '')
      })
    }
  }
  createRouteMap(){
    this.options.routes.forEach((item)=>{
      this.routeMap[item.path] = item.component
    })
  }
  initComponents(Vue){
    let self = this;
    Vue.component('router-link',{
      props:{
        to: String
      },
      created(){
      },
      render(h){
        return h('a',{
          attrs:{
            href:this.to
          },
          on: {
            click: this.handler
          }
        },[this.$slots.default])
      },
      methods:{
        handler(e){
          switch (this.$router.mode) {
            case 'history':
              this.historyHander(e)
              break;
            case 'hash':
              this.hashHander(e)
              break;
            default:
              break;
          }
        },
        historyHander(e){
          history.pushState({},'',this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        },
        hashHander(e){
          location.href = `#${this.to}`
          this.$router.data.current = this.to
          e.preventDefault()
        }
        
      }
    })
    

    Vue.component('router-view',{
      render(h){
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })

  }
}