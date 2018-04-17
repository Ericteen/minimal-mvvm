# minimal-mvvm

这是一个简化版的 mvvm 例子。实现对数据的双向绑定。对一个普通对象的变化进行监测，并作出相应的    通知。当数据改变后会自动打印新老数据以及数据的路径。

## 使用

```sh
yarn install
yarn start
```

## 实现思路

使用 ES5 的 `Object.defintProperty` 方法设置对象的数据属性和访问器属性。遍历对象的属性，将对象的属性都使用 `Object.defineProperty` 转化为 `getter/setter`。这样，在对对象的值进行修改的时候，就会调用 `set` 方法，在 `set` 方法里面回调通知。这样就实现了一个最简单的 mvvm。

针对数组中的变更通知，我创建了一个 fakePrototype 在上面绑定通知函数，然后将传入的数组指向这个 fakePrototype。即为 `array.__proto__` --> `fakePrototype` --> `Array.prototype`。
