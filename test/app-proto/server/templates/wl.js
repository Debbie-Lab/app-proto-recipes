import Template from '@app-proto/recipes/template'

export default class DefaultTpl extends Template {
  constructor(serveData) {
    super(serveData)
  }

  async toHtml() {
    const serveData = await JSON.stringify(this.serveData)
    console.log(null === this.page)
    console.log(this.page)
    return `
      <!DOCTYPE html>
      <html>
        <head></head>
        <script>window.serveData=${serveData}</script>
        <body>
          JS-CDN:${this.page}
        </body>
      </html>
    `
  }
}
