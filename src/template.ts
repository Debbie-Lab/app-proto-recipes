export default class Template {
  constructor (params) {
    this.page = params.page || null
    this.$data = params.$data || {}
  }

  async toHtml () {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        </head>
        <body>
          <main>${'Live for nothing or die for something.'}</main>
        </body>
      </html>
    `
  }
}

