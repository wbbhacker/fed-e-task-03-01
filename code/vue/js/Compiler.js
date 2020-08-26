class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  compile (el) {
    let  childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if(this.isTextNode(node)) {
        this.compileText(node)
      }else if( this.isElementNode(node) ){
        // 处理元素节点
        this.compileElement(node)
      }
      // 判断node 节点， 是否有子节点， 如果有子节点，要递归调用compile
      if(node.childNodes && node.childNodes.length){
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement (node) {
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.nodeName
      if(this.isDirective(attrName)){
        // v-text --> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
    // 判断是否是指令

  }
  // 

  update(node, key, attrName){
    let attrNameArr = attrName.split(':')
    let updateFn = this[attrNameArr[0] + 'Updater']
    let eventName = attrNameArr[1] || ''
    updateFn && updateFn.call(this, node, this.vm[key], key, eventName)

  }
  

  // 处理v-on 指令
  onUpdater(node, value, key, handerName ){
    node.addEventListener(handerName, this.vm.$options.methods[key])
  }

  // 处理v-html 指令
  htmlUpdater(node, value, key){
    node.innerHTML = value
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }

  // 处理v-text 指令
  textUpdater(node, value, key){
    // console.log(node)
    // console.log(value)
    node.textContent = value
    new Watcher(this.vm, key, (newValue)=>{
      node.textContent = newValue
    })
  }

  // 处理v-model 指令
  modelUpdater(node, value, key){
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 编译文本节点, 处理差值表达式
  compileText (node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if(reg.test(value)){
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher 对象,
      new Watcher(this.vm, key, (newValue)=> {
        node.textContent = newValue
      })

    }
  }
  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-') || attrName.startsWith('v-on:')
  }

  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }

}