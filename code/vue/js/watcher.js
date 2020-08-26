class Watcher {
  constructor (vm, key, cb) {

    this.vm = vm
    // data 中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb 

    // 把watcher 对象记录到Dep类的静态属性target
    Dep.target = this
    // 触发 get方法, 在get 方法中会调用addSub 把watch 添加到dep 中去
    this.oldValue = vm[key]
    Dep.target = null

  }

  // 当数据发生变化的时候更新视图
  update(){
    let newValue = this.vm[this.key]
    if(this.oldValue === newValue){
      return
    }
    this.cb(newValue)
  }

}