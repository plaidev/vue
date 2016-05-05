var compile = require('src/compiler').compile
var Vue = require('src')

describe('krt-cloak', function () {
  it('should not remove during compile', function () {
    var el = document.createElement('div')
    el.setAttribute('krt-cloak', '')
    compile(el, Vue.options)
    expect(el.hasAttribute('krt-cloak')).toBe(true)
  })

  it('should remove after compile', function () {
    var el = document.createElement('div')
    el.setAttribute('krt-cloak', '')
    new Vue({
      el: el
    })
    expect(el.hasAttribute('krt-cloak')).toBe(false)
  })
})
