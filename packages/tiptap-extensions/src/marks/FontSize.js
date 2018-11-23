import { Mark } from 'tiptap'

function getAttrs (fontSize) {
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
		    px: {default: null},
		  },
		  inline: true,
		  group: 'inline',
		  parseDOM: [
		    {
		      style: 'font-size',
		      getAttrs: getAttrs,
		    },
		  ],
		  toDOM(node: Node) {
		    const {px} = node.attrs
		    const style = px ? `font-size: ${px}px` : ''
		    return ['span', {style}, 0]
		  }
    }
  }

}
