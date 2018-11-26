import {
  Mark
} from 'tiptap'

import {
  updateMark
} from 'tiptap-commands'

export default class TextBackgroundColor extends Mark {

  get name() {
    return 'text_background_color'
  }

  get schema() {
    return {
      attrs: {
        background: '',
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        style: 'background-color',
        getAttrs: (background) => {
          return {
            background: background,
          }
        },
      }, ],
      toDOM(node) {
        const {
          background
        } = node.attrs
        let style = ''
        if (background) {
          style += `background-color: ${background}`
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
