class Observer{
  constructor(data){
    this.walk(data)
  }
  walk(data){
    // 1. 判断dota是否是对象
    if(!data || typeof data !== 'object'){
      return
    }
    // 2. 遍历data 对象的所有属性
    Object.keys(data).forEach(key=>{
      this.defineReative(data, key, data[key])
    })
  }
  defineReative(obj, key, val){
    let self = this
    
    // 负责收集依赖，并发送通知
    let dep = new Dep()

    // 如果val 是对象，把val内部的属性转换成响应式数据
    this.walk(val)

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        // 这里要val ，不能用obj[key] 这样会造成循环调用
        return val
      },
      set (newValue) {
        if (newValue === val) {
          return
        }
        val = newValue
        // 赋值为object 对象
        self.walk(newValue)
        console.log('sss')
        // 发送通知
        dep.notify()

      }
    })
  }
}