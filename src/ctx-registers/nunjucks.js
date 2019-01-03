const njks = require('nunjucks')
const join = require('path').join
const getDirObjs = require('@app-proto/recipes/utils').getDirObjs

const cwd = process.cwd()

const ASSETS_DEPS_JSON = join(cwd, '__deps__.json')
const deps = require(ASSETS_DEPS_JSON)

// 模板引擎 + 服务端渲染
exports.default = class Nunjucks {

  constructor (app) {
    const viewsDir = join(app.context.$config.appRootDir, 'server', 'views')
    this.env = new njks.Environment(new njks.FileSystemLoader(viewsDir), { autoescape: false })
    this.env.addExtension('SSRExtension', new SSRExtension(app.context.$config.path.bundles))
    this.env.addExtension('StylesheetExtension', new StylesheetExtension())
  }

  async render (name, context = {}) {
    return new Promise((resolve, reject) => {
      this.env.render(name, context, ( err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }
}

const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const ReactDOMServer = require('react-dom/server')

class Ext {
  parse (parser, nodes, lexer) {
    const tok = parser.nextToken()

    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(tok.value)

    return new nodes.CallExtensionAsync(this, 'run', args)
  }
}

class StylesheetExtension extends Ext {
  constructor () {
    super()
    this.tags = [ 'stylesheet' ]
  }

  run (context, ...pages) {
    const callback = pages.pop()
    const res = pages.filter(page => !!deps[page].css).map(page => `<link rel="stylesheet" href="${deps[page].css}">`).join('')
    callback(null, res)
  }
}

class SSRExtension extends Ext {
  constructor (opts) {
    super()
    this.tags = [ 'render' ]
    this.pages = getDirObjs(opts.path, opts.whitelist || [])
  }

  scriptTags (page, name, data) {
    return `
      <script type="text/javascript">
        window.__init__data = window.__init__data || {};
        window.__init__data.${name} = ${JSON.stringify(data)};
      </script>
      <script crossorigin="anonymous" type="text/javascript" src="${deps[page].js}"></script>
    `
  }

  /**
   * @page 服务端渲染页面 ➙ ./resources/pages/**.page.js
   * @data 根组件Props数据
   * @name 组件名
   */
  run (context, page, data, name, callback) {
    const scriptTags = this.scriptTags(page, name, data)
    const app = this.pages[page](data)
    if (app instanceof Vue) {
      renderer.renderToString(this.pages[page](data), (err, html) => callback(err, html + this.scriptTags(page, name, data)))
    } else {
      const ssr = ReactDOMServer.renderToString(this.pages[page](data))
      callback(null, `<div id="${name}">${ssr}</div>` + this.scriptTags(page, name, data))
    }
  }
}

