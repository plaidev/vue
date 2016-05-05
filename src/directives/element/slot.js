import { SLOT } from '../priorities'
import {
  extractContent,
  replace,
  remove
} from '../../util/index'

export default {

  priority: SLOT,
  params: ['name'],

  bind () {
    // this was resolved during component transclusion
    var name = this.params.name || 'default'
    var content = this.vm._slotContents && this.vm._slotContents[name]
    if (!content || !content.hasChildNodes()) {
      this.fallback()
    } else {
      this.compile(content.cloneNode(true), this.vm._context, this.vm)
    }
  },

  compile (content, context, host) {
    if (content && context) {
      if (
        this.el.hasChildNodes() &&
        content.childNodes.length === 1 &&
        content.childNodes[0].nodeType === 1 &&
        content.childNodes[0].hasAttribute('krt-if')
      ) {
        // if the inserted slot has krt-if
        // inject fallback content as the krt-else
        const elseBlock = document.createElement('template')
        elseBlock.setAttribute('krt-else', '')
        elseBlock.innerHTML = this.el.innerHTML
        // the else block should be compiled in child scope
        elseBlock._context = this.vm
        content.appendChild(elseBlock)
      }
      const scope = host
        ? host._scope
        : this._scope
      this.unlink = context.$compile(
        content, host, scope, this._frag
      )
    }
    if (content) {
      replace(this.el, content)
    } else {
      remove(this.el)
    }
  },

  fallback () {
    this.compile(extractContent(this.el, true), this.vm)
  },

  unbind () {
    if (this.unlink) {
      this.unlink()
    }
  }
}
