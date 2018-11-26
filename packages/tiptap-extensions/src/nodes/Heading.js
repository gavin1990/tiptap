import { Node } from 'tiptap'
import { setBlockType, textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'
import { toParagraphDOM, getParagraphNodeAttrs } from './Paragraph'

const TAG_NAME_TO_LEVEL = {
  'H1': 1,
  'H2': 2,
  'H3': 3,
  'H4': 4,
  'H5': 5,
  'H6': 6,
}

function toDOM (node) {
  const dom = toParagraphDOM(node)
  const level = node.attrs.level || 1
  dom[0] = `h${level}`
  return dom
}

function getAttrs (dom) {
  const attrs = getParagraphNodeAttrs(dom)
  const level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1
  attrs.level = level
  return attrs
}

export default class Heading extends Node {

  get name() {
    return 'heading'
  }

  get defaultOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    }
  }

  get schema() {
    return {
      attrs: {
        level: {
          default: 1,
        },
        align: { default: null },
        id: { default: null },
        indent: { default: null },
        lineSpacing: { default: null },
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'h1', getAttrs },
        { tag: 'h2', getAttrs },
        { tag: 'h3', getAttrs },
        { tag: 'h4', getAttrs },
        { tag: 'h5', getAttrs },
        { tag: 'h6', getAttrs },
      ],
      toDOM,
    }
  }

  commands({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }

  keys({ type }) {
    return this.options.levels.reduce((items, level) => ({
      ...items,
      ...{
        [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
      },
    }), {})
  }

  inputRules({ type }) {
    return this.options.levels.map(level => textblockTypeInputRule(
      new RegExp(`^(#{1,${level}})\\s$`),
      type,
      () => ({ level }),
    ))
  }

}
