import { Node } from 'tiptap'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'
import { toParagraphDOM, getParagraphNodeAttrs } from './Paragraph'

function toDOM (node) {
  const dom = toParagraphDOM(node)
  dom[0] = 'blockquote'
  return dom
}

function getAttrs (dom) {
  return getParagraphNodeAttrs(dom)
}

export default class Blockquote extends Node {

  get name() {
    return 'blockquote'
  }

  get schema() {
    return {
      attrs: {
        align: { default: null },
        id: { default: null },
        indent: { default: null },
        lineSpacing: { default: null },
      },
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'blockquote' },
      ],
      toDOM: () => ['blockquote', 0],
    }
  }

  commands({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph)
  }

  keys({ type }) {
    return {
      'Ctrl->': toggleWrap(type),
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type),
    ]
  }

}
