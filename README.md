
## app-proto-recipes

>Read the specification of directories (for app-proto scaffold).


```bash
npm publish --access=public
```

## 注意

### TypeScript Koa 类型检查

在文件`node_modules/@types/koa/index.d.ts`文件中，`BaseContext`类声明中`onerror`方法下面添加一行`[key: string]: any;`。

```js
onerror(err: Error): void;
+ [key: string]: any;
```