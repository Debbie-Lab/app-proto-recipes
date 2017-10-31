# Datasources

功能：对数据进行封装、聚合，提供统一的数据来源；处于前后端分离的"枢纽"位置。

"理想"情况下，前端通过调用后端某个（Restful风格API）接口即可满足前端的业务逻辑、渲染。
可实际开发中，存在着许许多多的 **非** "理想"的困扰:

1. 前端的某个模块的数据可能来自不同后端（团队）数据服务，要求后端提供一份让前端开发者"舒适"的数据？先不论协商沟通的成本，后端更改接口的进度需与前端迭代需保持一致，这种要求违背了前后端分离的初衷。

2. 前后端开发周期不一致，前端研发阶段并不一定能及时拿到后端的接口数据（或者满足前端某种交互场景的"临界"数据）；这意味着，后端的进度会"阻塞"到前端的研发。

## 映射逻辑

Node服务启动时，会提前解析项目`server/datasources`目录下的`.js`、`.hjson`、`.json`文件并封装成一个`async function`；
此外，并将该函数绑定在`ctx.$ds`对象中，函数名按照该文件相对`server/datasources`所在路径进行`camelCase`规则命名。
比如，我们需要新增一个"用户"数据源（即获取用户姓名、住址等信息）可以新建文件`server/datasources/zhenguo/user.js`，内容格式大致如下：

```js
export default async function (ctx, params) {
  try {
    const uri = 'https://vipx-***.com/zhenguo/user/' + params.userId
    const result = await ctx.http.get(uri)
    // 校验请求结果
    return result
  } catch (error) {
    // 异常处理
  }
}
```

## 使用方法

```js
ctx.$ds[''](ctx, params, {
  mock: false,          // 是否采用mock数据
  cache: false,         // 是否启用缓存
  cacheAge: 5000,       // 缓存有效时间，cache值为`true`生效
  cacheKey: null,       // 缓存key生成回调，cache值为`true`生效，默认计算方式为`${ds-path}-${hash(params)}`
})

// 获取用户信息举例
const userInfo = await ctx.$ds.zhenguoUser(ctx, { userId: 87654312 })
```

### 数据模拟

除了`.js`后缀文件之外，亦可以在同目录下新增同名但后缀为`.json`、`.hjson`文件。
如果在调用数据源函数时，配置`mock`为`true`时则会将`.json`、`.hjson`文件解析的内容作为结果。

- `.json`   => [Introducing JSON](http://www.json.org/) | [Mock.js](http://mockjs.com), a simulation data generator.
- `.hjson`  => [Hjson](http://hjson.org/), a user interface for JSON.

### 缓存请求

对于某些数据实时性要求不高，可以添加内存级别缓存。配置参数：

- `cache`：默认值为`false`；设置`true`则开启缓存功能
- `cacheAge`：缓存有效时间，过期后会自动清理缓存对象
- `cacheKey`：缓存key生成回调，cache值为`true`生效，默认计算方式为`${ds-path}-${hash(params)}`。

> **注意**：此处采用内存级别缓存，虽然会转成[Buffer](https://nodejs.org/api/buffer.html)数据类型存储但是亦不能超过服务器内存限制。（目前尚未遭遇那么大数量级的服务）。


