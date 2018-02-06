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
  Object.defineProperty(obj, key, {
    enumerable: true,   // 属性可枚举
    configurable: true, // 属性可以修改或删除
    get: function reactiveGetter() {
      return val // 实际上会依赖收集，下一节会讲
    },
    set: function reactiveStter(newVal) {
      if (newVal === val) return
      cb(newVal) // 这里要重新赋值，应该在这个回调里赋值
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
  }
}

let vv = new Vue({
  data: {
    test: 'hello world~'
  }
})

vv._data.test = 'I am a coder.' // 视图更新了~~ 