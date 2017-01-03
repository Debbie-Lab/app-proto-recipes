// Templates
class Templates {
  constructor(js, css, data) {
    this.js = js || []
    this.css = css || []
    this.data = data || {}
  }

  renderJs() {

  }

  renderCss() {

  }

  toHtml() {
    return '<!DOCTYPE html>'
  }
}
