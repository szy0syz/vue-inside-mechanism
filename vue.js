function cb(val) {
  // 渲染视图
  console.log('视图更新了~~')
}

function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,   // 属性可枚举
    configurable: true, // 属性可以修改或删除
    get: function reactiveGetter() {
      return val // 实际上会依赖收集，下一节会讲
    },
    set: function reactiveStter(newVal) {
      if (newVal === val) return
      cb(newVal) // 这里要重新赋值，应该后面才讲
    }
  })
}

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
    observer(this._data)
  }
}

let vv = new Vue({
  data: {
    test: 'hello world~'
  }
})

vv._data.test = 'I am a coder.' // 视图更新了~~ 