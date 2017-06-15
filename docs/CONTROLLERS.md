
# 控制器 | Controller

控制器Controller负责转发请求：根据客户端请求的Url或参数，指定欲反馈给客户端的渲染模板（以及为模板准备的渲染参数）。
其文件目录结构大致如下：

```bash
# server/controllers
  .
  ├── default.js
  ├── user
  │   ├── detail.js
  │   ├── exhibition.js
  │   └── sign-up.js
  │   └── channel.js
  └── wxx.js
```

## Schema格式约定

每个Controller文件Schema格式约定如下：

```js
export default {
  urls: ['/schema', '/foo'],            // 指定url，未指定则以该文件路径进行推断
  methods: ['GET'],                     // 指定method，默认为`["GET"]`
  middlewares: ['schema-logger'],       // 指定该次请求需执行的中间件，默认为`[]`
  template: 'schema',                   // 指定HTML渲染的模板
  controller: async function (ctx) {    // Controller 函数
    return {foo: 'hello', bar: 'world'}
  },
}
```

### urls
指定url，可指定多个url，实现不同url访问同个页面。

如果未设置url，则会以该文件路径进行url推断。  
比如，Controller文件`server/controllers/user/sign-up.js`没有指定url，app-proto会自动加上`["/user/sign-up"]`url配置。

此外，url除了指定明确的字符串之外，也支持[Path-to-RegExp](https://github.com/pillarjs/path-to-regexp)正则匹配。  
比如，你的url设置为`['/user/:name']`，那么在`controller()`函数中可以通过`ctx.params.name`来获取该值。

### methods
指定HTTP请求方法，可不明确指定，默认值为`["GET"]`。


### middlewares 索引数组
指定该次请求需执行的中间件索引，可不明确指定，默认值为`[]`。

需要注意的是，所引入的中间件索引需在`server/middlewares`目录下有定义，且避免与`$global.js`引入冲突。

### template 索引
指定该次请求欲渲染的模板文件索引，如果设定，`controller()`函数的返回值则为该模板的模板参数。需要注意的是：
- 如果指定模板，但是`controller()`函数没有返回值则该模板设置无效。
- 模板渲染会覆盖之前所有的`ctx.body=***`赋值，如果不想`ctx.body`被覆盖，请勿在`controller()`函数中添加返回值。
- 模板文件的索引需在`server/templates`目录下有定义。


### `controller()` 函数

`controller()`函数在app-proto中是Koa中间件链的最后一环，充当MVC架构中Controller层的角色，其实质为一个Koa中间件`async (ctx, next) => {}`。

对于`controller()`函数，如果有返回值：
- 指定了`template`索引，则返回值将作为模板参数进行模板处理。
- 未指定`template`索引，则返回值将以JSON对象的形式输出给客户端。

当然，`controller()`函数完全可以不依赖返回值，你可以通过`ctx.body=***`形式反馈内容给客户端，也可以通过`ctx.render()`方法指定模板、参数，进行HTML格式输出:
```js
ctx.render(
  'schema',     // 模板
  {status: 0, data: {foo: 'hello', bar: 'world'}}, // 模板参数
  'default'     // 前端源码通过"构建"供Node层使用的bundle文件索引，可不设置
)
```

最后，controller文件亦可以数组的形式写入（数组形式url推断将无效），

## 更多举例

### 从Url中匹配参数
```js
export default {
  urls: ['/user/:id'],
  template: 'user-info',
  controller: async function (ctx) {
    const id = ctx.params.id
    const userInfo = await getUserInfoById(id)
    return userInfo
  },
}

```

### 对某个Url请求要求执行特殊的中间件
```js
export default {
  urls: ['/money'],
  middlewares: ['sso'],     // 请求`/money`时需执行sso中间件（sso中间件在`server/middlewares`目录下定义）
  controller: async function (ctx) {
    return {}
  },
}

```

### 不同url执行同个controller
```js
export default {
  urls: ['/', '/index', '/default'],
  template: 'default',
  controller: async function (ctx) {
    return {}
  },
}

```
请求`/`、`/index`、`/default`访问的均是同一个页面。

### 手动控制渲染模板
```js
export default {
  urls: ['/user/:id'],
  controller: async function (ctx) {
    const id = ctx.params.id
    const userInfo = await getUserInfoById(id)
    ctx.render('user-info', userInfo, 'user-info')
  },
}

```

### 一个文件中配置多个Url
```js
export default [
  // 方式一：渲染HTML格式页面
  {
    urls: ['/schema', '/foo'],
    methods: ['GET'],
    middlewares: ['schema-logger'],
    template: 'schema',
    controller: async function (ctx) {
      return {foo: 'hello', bar: 'world'}
    },
  },
  // 方式二：渲染JSON格式数据
  {
    urls: ['/s'],
    methods: ['POST', 'GET'],
    middlewares: ['schema-logger'],
    controller: async function (ctx) {
      // 没有指定模板，返回值将默认以`JSON`格式输出
      return {status: 0, data: {foo: 'hello', bar: 'world'}}
    },
  },
  // 方式三：渲染HTML格式页面，但不依赖返回值
  {
    urls: ['/bar'],
    controller: async function (ctx) {
      // 没有指定模板，且没有返回值
      // 通过`ctx.render()`方法指定模板、参数，进行`HTML`格式输出
      ctx.render(
        'schema',     // 模板
        {status: 0, data: {foo: 'hello', bar: 'world'}}, // 模板参数
        'default'     // 前端源码通过"构建"供Node层使用的bundle文件索引，可不设置
      )
    },
  },
]
```
