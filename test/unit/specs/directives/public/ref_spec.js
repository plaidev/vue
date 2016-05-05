var _ = require('src/util')
var Vue = require('src')

describe('ref', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  var components = {
    test: {
      id: 'test'
    },
    test2: {
      id: 'test2'
    }
  }

  it('normal', function () {
    var vm = new Vue({
      el: el,
      components: components,
      data: {
        ref: 'test2'
      },
      template: '<test krt-ref:test></test><test2 krt-ref:test-case></test2>'
    })
    expect(vm.$refs.test).toBeTruthy()
    expect(vm.$refs.test.$options.id).toBe('test')
    expect(vm.$refs.testCase).toBeTruthy()
    expect(vm.$refs.testCase.$options.id).toBe('test2')
  })

  it('with dynamic component', function (done) {
    var vm = new Vue({
      el: el,
      components: components,
      data: { test: 'test' },
      template: '<component :is="test" krt-ref:test></component>'
    })
    expect(vm.$refs.test.$options.id).toBe('test')
    vm.test = 'test2'
    _.nextTick(function () {
      expect(vm.$refs.test.$options.id).toBe('test2')
      vm.test = ''
      _.nextTick(function () {
        expect(vm.$refs.test).toBeNull()
        done()
      })
    })
  })

  it('with dynamic component + keep-alive', function (done) {
    var vm = new Vue({
      el: el,
      components: components,
      data: { test: 'test' },
      template: '<component :is="test" krt-ref:test keep-alive></component>'
    })
    expect(vm.$refs.test.$options.id).toBe('test')
    vm.test = 'test2'
    _.nextTick(function () {
      expect(vm.$refs.test.$options.id).toBe('test2')
      vm.test = ''
      _.nextTick(function () {
        expect(vm.$refs.test).toBe(null)
        done()
      })
    })
  })

  it('should be reactive when bound by dynamic component and hoisted', function (done) {
    var vm = new Vue({
      el: el,
      data: { view: 'one' },
      template:
        '{{$refs.test.value}}' +
        '<component :is="view" krt-ref:test></component>' +
        '<div krt-if="$refs.test.value > 1">ok</div>',
      components: {
        one: {
          id: 'one',
          replace: true,
          data: function () {
            return { value: 1 }
          }
        },
        two: {
          id: 'two',
          replace: true,
          data: function () {
            return { value: 2 }
          }
        }
      }
    })
    expect(vm.$refs.test.$options.id).toBe('one')
    expect(el.textContent).toBe('1')
    vm.view = 'two'
    _.nextTick(function () {
      expect(vm.$refs.test.$options.id).toBe('two')
      expect(el.textContent).toBe('2ok')
      vm.view = ''
      _.nextTick(function () {
        expect(vm.$refs.test).toBeNull()
        expect(el.textContent).toBe('')
        done()
      })
    })
  })

  // #1147
  it('should be able to reference host via ref inside transclusion content', function (done) {
    var vm = new Vue({
      el: el,
      template:
        '<div>' +
          '<comp krt-ref:out>{{$refs.out.msg}}</comp>' +
        '</div>',
      components: {
        comp: {
          template: '<slot></slot>',
          data: function () {
            return { msg: 'foo' }
          }
        }
      }
    })
    expect(getWarnCount()).toBe(0)
    expect(vm.$el.textContent).toBe('foo')
    vm.$children[0].msg = 'bar'
    _.nextTick(function () {
      expect(vm.$el.textContent).toBe('bar')
      done()
    })
  })

  it('warn when used on non-component node', function () {
    new Vue({
      el: el,
      template: '<div krt-ref:test></div>'
    })
    expect('must be used on a child component').toHaveBeenWarned()
  })
})
