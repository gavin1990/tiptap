import {
  Mark
} from 'tiptap'

import {
  updateMark
} from 'tiptap-commands'

export default class TextColor extends Mark {

  get name() {
    return 'text_color'
  }

  get schema() {
    return {
      attrs: {
        color: '',
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        style: 'color',
        getAttrs: (color) => {
          return {
            color: color,
          }
        },
      }, ],
      toDOM(node) {
        const {
          color
        } = node.attrs
        let style = ''
        if (color) {
          style += `color: ${color}`
        }
        return [
          'span',
          {
            style
          },
          0,
        ]
      },
    }
  }

  commands({
    type
  }) {
    return attrs => {
      return updateMark(type, attrs)
    }
  }

}
