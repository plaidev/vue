var Vue = require('src')

describe('krt-pre', function () {
  it('should work', function () {
    var vm = new Vue({
      el: document.createElement('div'),
      template: '<div krt-pre>{{a}}</div>',
      data: {
        a: 123
      }
    })
    expect(vm.$el.firstChild.textContent).toBe('{{a}}')
  })

  it('should work on root node', function () {
    var vm = new Vue({
      el: document.createElement('div'),
      template: '<div krt-pre>{{a}}</div>',
      replace: true,
      data: {
        a: 123
      }
    })
    expect(vm.$el.textContent).toBe('{{a}}')
    expect(getWarnCount()).toBe(0)
  })
})
