import {
  Mark
} from 'tiptap'

import {
  updateMark
} from 'tiptap-commands'

function getAttrs(fontSize) {
  const attrs = {}
  if (!fontSize) {
    return attrs
  }

  return {
    px: fontSize,
  }
}

export default class FontSize extends Mark {

  get name() {
    return 'font_size'
  }

  get schema() {
    return {
      attrs: {
        px: {
          default: null
        },
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        style: 'font-size',
        getAttrs: getAttrs,
      }, ],
      toDOM(node) {
        const {
          px
        } = node.attrs
        const style = px ? `font-size: ${px}px` : ''
        return ['span', {
          style
        }, 0]
      }
    }
  }

  commands({
		type
	}) {
    return attrs =>  {
			return updateMark(type, attrs)
    }
  }

}
