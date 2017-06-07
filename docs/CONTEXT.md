
# Context

在Koa中的任何一次请求都会产生一个全新的上下文`Context`，除了内置的 `ctx.request` 和 `ctx.response` 之外，我们对`Context`内置了如下的扩展：

```js
app.use(ctx => {
  // can use
  ctx.$config        // 「只读」
  ctx.$data          // 「可修改」  供模板使用的数据：可以在中间件中修改`$data`对象
  ctx.$routes        // 「只读」    server-routes 服务端设定的Url路由
  ctx.$ds            // 「只读」    datasources
  ctx.$middlewares   // 「只读」    middlewares   中间件列表
  ctx.$tpls          // 「只读」    templates     可以采用的渲染模板
  ctx.$pages         // 「只读」    pages         能被渲染的页面
})
```

>需要注意的是`ctx.$routes`、`ctx.$middlewares`、`ctx.$tpls`和`ctx.$pages`在开发中一般不会被使用到，主要用途在于调试。 关于Koa上下文介绍详见： https://github.com/koajs/koa/blob/master/docs/api/context.md。

如果你想给`ctx`扩展新的对象，可以在目录`server/context`新建一个`.js`文件(要求抛出一个类)，
在Koa应用启动时会自动扩展至`ctx`中。比如，在每个中间件中可能都会使用到`http`(发请求)，
你可以创建`http.js`，内容格式如下：

```js
// 抛出一个类
export default class Http {
  post(uri, data) {}
  get(uri) {}
}
```

在Koa应用启动时，就会自动创建一个`Http`的实例并扩展至`ctx.http`中(即`ctx.http = new Http()`)。
扩展行为在Koa实例执行`listen()`前启动，这样对于任何一次请求都会复用`ctx.http`这个实例，无需重复创建、初始化。

```js
// 传统方式
import Http form '@server/context/http'
app.use(ctx => {
  // 每次请求时都会新建一个 Http实例(耗资源)
  const http = new Http()
})

// 扩展Context方式
app.use(ctx => {
  // 整个Koa应用中，每次请求都复用同一个Http实例
  const http = ctx.http
})
```

原则上，对于那些初始化工作稍重的对象都建议采用扩展`Context`的方式实现，典型的如数据库连接实例等。
