const OP = Object.prototype;
const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

export class MV {
  constructor(obj, cb) {
    if (OP.toString.call(obj) !== '[object Object]') {
      console.error(`${obj} should be an object.`);
    }
    this.$cb = cb;
    this.observe(obj);
  }

  observe(obj, path) {
    if (OP.toString.call(obj) === '[object Array]') {
      this.overrideArrayProto(obj, path);
    }
    Object.keys(obj).forEach(function (key, index) {
      let oldVal = obj[key];
      let pathArray = path && path.slice(0);
      if (pathArray) {
        pathArray.push(key);
      } else {
        pathArray = [key];
      }
      Object.defineProperty(obj, key, {
        get: function () {
          return oldVal;
        },

        set: (function (newVal) {
          if (oldVal !== newVal) {
            if (OP.toString.call(newVal) === '[object Object]' || OP.toString.call(newVal) === '[object Array]') {
              this.observe(newVal, pathArray);
            }
            this.$cb(newVal, oldVal, pathArray);
            oldVal = newVal;
          }
        }).bind(this)
      });

      if (OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj[key]) === '[object Array]') {
        this.observe(obj[key], pathArray);
      }
    }, this);
  }

  overrideArrayProto(array, path) {
    const originalProto = Array.prototype;
    const overrideProto = Object.create(Array.prototype);
    const self = this;
    let result;
    Object.keys(OAM).forEach(function(key, index) {
      const method = OAM[index];
      let oldArray = [];
      Object.defineProperty(overrideProto, method, {
        value: function() {
          oldArray = this.slice(0);

          var arg = [].slice.apply(arguments);
          // 调用原始 原型 的数组方法
          result = originalProto[method].apply(this, arg);
          // 对新的数组进行监测
          self.observe(this, path);
          // 执行回调
          self.$cb(this, oldArray, path);

          return result;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }, this);

    array.__proto__ = overrideProto;
  }
}
