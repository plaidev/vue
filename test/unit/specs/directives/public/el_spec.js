var _ = require('src/util')
var Vue = require('src')

describe('el', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('normal', function (done) {
    var vm = new Vue({
      el: el,
      data: {
        ok: true
      },
      template: '<div krt-if="ok" krt-el:test-el id="test"></div>'
    })
    expect(vm.$els.testEl).toBeTruthy()
    expect(vm.$els.testEl.id).toBe('test')
    vm.ok = false
    _.nextTick(function () {
      expect(vm.$els.testEl).toBeNull()
      vm.ok = true
      _.nextTick(function () {
        expect(vm.$els.testEl.id).toBe('test')
        done()
      })
    })
  })

  it('inside krt-for', function () {
    var vm = new Vue({
      el: el,
      data: { items: [1, 2] },
      template: '<div krt-for="n in items"><p krt-el:test>{{n}}</p>{{$els.test.textContent}}</div>'
    })
    expect(vm.$el.textContent).toBe('1122')
  })
})
