import { Node } from 'tiptap'
import { wrappingInputRule, toggleList } from 'tiptap-commands'
import { INDENT_PADDING_PX_SIZE, ATTRIBUTE_INDENT, MIN_INDENT_LEVEL } from './Paragraph'

export default class Bullet extends Node {

  get name() {
    return 'bullet_list'
  }

  get schema() {
    return {
      attrs: {
        id: {default: null},
        indent: {default: 0},
        listStyleType: {default: null},
      },
      content: 'list_item+',
      group: 'block',
      parseDOM: [{
        tag: 'ul',
        getAttrs(dom) {
          const listStyleType = dom.getAttribute('data-list-style-type') || null

          const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) : MIN_INDENT_LEVEL

          return {
            indent,
            listStyleType,
          }
        },
      }],
      toDOM(node) {
        const {
          indent,
          listStyleType
        } = node.attrs
        const attrs = {}
        let style = ''
        if (indent) {
          style += `padding-left: ${indent * INDENT_PADDING_PX_SIZE}px;`
          attrs[ATTRIBUTE_INDENT] = indent
        }
        if (listStyleType) {
          attrs['data-list-style-type'] = listStyleType
        }
        if (style) attrs.style = style
        return ['ul', attrs, 0]
      },
    }
  }

  commands({ type, schema }) {
    return () => toggleList(type, schema.nodes.list_item)
  }

  keys({ type, schema }) {
    return {
      'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item),
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*([-+*])\s$/, type),
    ]
  }

}
