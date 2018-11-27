import { Node } from 'tiptap'
import { wrappingInputRule, toggleList } from 'tiptap-commands'
import { INDENT_PADDING_PX_SIZE, ATTRIBUTE_INDENT, MIN_INDENT_LEVEL } from './Paragraph'

export default class OrderedList extends Node {

  get name() {
    return 'ordered_list'
  }

  get schema() {
    return {
      attrs: {
        id: {default: 1},
        indent: {default: MIN_INDENT_LEVEL},
        listStyleType: {default: null},
        order: {
          default: 1,
        },
      },
      content: 'list_item+',
      group: 'block',
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom) {
            const listStyleType = dom.getAttribute('data-list-style-type') || null

            const order = dom.hasAttribute('start') ? parseInt(dom.getAttribute('start'), 10) : 1

            const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) : MIN_INDENT_LEVEL

            return {
              indent,
              listStyleType,
              order,
            }
          },
        },
      ],
      toDOM(node) {
        const {order, indent, listStyleType} = node.attrs
        const attrs = {}
        let style = ''
        if (order > 1) {
          attrs.start = order
        }

        if (indent !== MIN_INDENT_LEVEL) {
          style += `padding-left: ${indent * INDENT_PADDING_PX_SIZE}px;`
          attrs[ATTRIBUTE_INDENT] = indent
        }

        if (listStyleType) {
          attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType
        }
        if (style) attrs.style = style
        return ['ol', attrs, 0]
      },
    }
  }

  commands({ type, schema }) {
    return () => toggleList(type, schema.nodes.list_item)
  }

  keys({ type, schema }) {
    return {
      'Shift-Ctrl-9': toggleList(type, schema.nodes.list_item),
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        type,
        match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order === +match[1],
      ),
    ]
  }

}
