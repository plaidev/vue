import { warn } from '../../util/index'

export default {
  bind () {
    process.env.NODE_ENV !== 'production' && warn(
      'krt-ref:' + this.arg + ' must be used on a child ' +
      'component. Found on <' + this.el.tagName.toLowerCase() + '>.',
      this.vm
    )
  }
}
