import {
  Mark
} from 'tiptap'
import WebFontLoader from 'webfontloader'
import {
  updateMark
} from 'tiptap-commands'

export const FONT_TYPE_NAMES = [
  // SERIF
  'Arial',
  'Arial Black',
  'Georgia',
  'Tahoma',
  'Times New Roman',
  'Times',
  'Verdana',
  // MONOSPACE
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
]
const RESOLVED_FONT_NAMES = new Set(FONT_TYPE_NAMES)

export default class FontFamily extends Mark {

  get name() {
    return 'font_family'
  }

  get schema() {
    return {
      attrs: {
        name: '',
      },
      inline: true,
      group: 'inline',
      parseDOM: [{
        style: 'font-family',
        getAttrs: (name) => {
          return {
            name: name ? name.replace(/[\"\']/g, '') : '',
          }
        },
      }, ],
      toDOM(node) {
        const {
          name
        } = node.attrs
        const attrs = {}
        if (name) {
          if (!RESOLVED_FONT_NAMES.has(name)) {
            // TODO: Cache custom fonts and preload them earlier.
            RESOLVED_FONT_NAMES.add(name)
            // https://github.com/typekit/webfontloader
            WebFontLoader.load({
              google: {
                families: [name]
              }
            })
          }
          attrs.style = `font-family: ${name}`
        }
        return ['span', attrs, 0]
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
