// 订阅者
class Dep {
  constructor () {
    console.log('新建一个Dep订阅者')
    // 用来存放Watcher对象的数组
    this.subs = []
  }

  // 在subs中添加一个Watcher对象
  addSub (sub) {
    this.subs.push(sub)
    console.log('this.subs.length',this.subs.length)
    // 测试相等不
    if(this.subs.length>1) {
      console.log('真相--->', this.subs[0].update === this.subs[1].update)
    }
  }

  //
  notify () {
    // subs为什么会变少
    console.log('subs为什么会变少', this.subs)
    this.subs.forEach((sub) => {
      // 这里sub就是一个个wather实例
      sub.update()
    })
  }
}

// 观察者
class Watcher {
  constructor () {
    // 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到
    Dep.target = this
    // 原来是这里，这里是个静态属性，你管你new几次，牢牢地只会指向一个地址
  }

  // 更新视图的方法
  update() {
    console.log('视图更新啦啦啦~~~', Date.now())
  }
}

// 暂时先置空
Dep.target = null

/* 
*  定义响应式的对象属性 
*  流程：将传入的对象，其属性名，值配置一下
*        然后分别设置get和set
*        get时会进行依赖收集
*        set时会触发回调来重新赋值和更新试图
* 【add】：依赖收集
*/       
function defineReactive(obj, key, val) {
  /* new一个Dep类对象实例 */
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true,   // 属性可枚举
    configurable: true, // 属性可以修改或删除
    get: function reactiveGetter() {
      /* 将Dep.target（即当前的Watcher对象)存入dep的subs中 */
      dep.addSub(Dep.target)
      return val // 依赖收集
    },
    set: function reactiveStter(newVal) {
      if (newVal === val) return
      // 在set的时候触发dep的notify来通知所有的Wathcer对象更新视图
      dep.notify();
    }
  })
}

/* 【可观察的】
* 作用 将传进来的对象的所有属性可观察化
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
    // 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象
    new Watcher();
    // 在这里模拟render的过程，为了触发test属性的get函数
    console.log('render~', this._data.name);
  }
}

let globalObj = {
  name: 'szy'
}

// let v = new Vue({
//   data: {
//     name: '123'
//   }
// })

let vv1 = new Vue({
  data: globalObj
})

let vv2 = new Vue({
  data: globalObj
})

// 按理说应该要更新两次才对，但才更新一次？
// globalObj.name = 'szy999'

// globalObj = {
//   name: '我是哈哈'
// }

// 实际上就是给这个对象的这个属性get和set分别做了操作
// 对这个对象的这个属性使用 获取操作时 会收集依赖，也就是将Watcher实例放到dep.subs订阅者们数据中
// 而对这个对象的这个属性使用 设置操作时 会进行通知 notify 操作
globalObj.name = 'szy999'
// globalObj = {
//   name: '12312321321321'
// }

// v._data.name = '123123'
// v._data.name = '123123'
// v._data.name = '123123'