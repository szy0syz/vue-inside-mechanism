function cb(val) {
  // 渲染视图
  console.log('视图更新了~~')
}

/* 
*  定义响应式的对象属性 
*  流程：将传入的对象，其属性名，值配置一下
*        然后分别设置get和set
*        get时会进行依赖收集
*        set时会触发回调来重新赋值和更新试图
*/       
function defineReactive(obj, key, val) {
  // 一个Dep类对象
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,   // 属性可枚举
    configurable: true, // 属性可以修改或删除
    get: function reactiveGetter() {
      // 将Dep.target (即当前的Watcher对象存入dep的subs中)
      dep.addSub(Dep.target)
      return val // 实际上会依赖收集，下一节会讲
    },
    set: function reactiveStter(newVal) {
      if (newVal === val) return
      // 在set时触发dep的notify来通知所有的Watcher对象更新视图
      dep.notify()
    }
  })
}

/* 【观察者】
* 流程
*   - 判断传入value是空或者非对象就返回
*   - 遍历对象中所有可遍历属性逐一加入defineReactive函数将属性变为响应式
*/
function observer (value) {
  if (!value || (typeof value !== 'object')) {
    return
  }

  Object.keys(value).forEach(function(key) {
    defineReactive(value, key, value[key])
  })
}

class Vue {
  constructor(options) {
    this._data = options.data
    // 将Vue类的data对象放入观察者函数
    // 意思也就是把data对象的所有属性整成响应式的，有个东西三改变了就看情况更新试图等
    observer(this._data)
    // 新建一个Watch观察者对象，这时候Dep.target会指向这个Watcher对象
    new Watcher()
    // 在这里模拟render的过程，为了触发test属性的get函数
    cosole.log('render~~~', this._data.test)
  }
}

///////////////////////////测试////////////////////////////

let vv = new Vue({
  data: {
    test: 'hello world~'
  }
})

vv._data.test = 'I am a coder.' // 视图更新了~~ 