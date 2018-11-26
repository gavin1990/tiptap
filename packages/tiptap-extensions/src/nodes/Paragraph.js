import { setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

export const INDENT_PADDING_PX_SIZE = 30
export const MIN_INDENT_LEVEL = 0
export const MAX_INDENT_LEVEL = 7
export const ATTRIBUTE_INDENT = 'data-indent'

const ALIGN_PATTERN = /(left|right|center|justify)/

export const clamp = (min, val, max) => {
  if (val < min) {
    return min
  }
  if (val > max) {
    return max
  }
  return val
}

export const convertPaddingLeftToIndentValue = paddingLeft => {
  return clamp(
    MIN_INDENT_LEVEL,
    Math.floor(paddingLeft / INDENT_PADDING_PX_SIZE),
    MAX_INDENT_LEVEL,
  )
}

const toDOM = node => {
  const { align, indent, lineSpacing } = node.attrs
  const attrs = {}

  let style = ''
  if (align && align !== 'left') {
    style += `text-align: ${align};`
  }

  if (lineSpacing) {
    style += `line-height: ${lineSpacing};`
  }

  if (indent) {
    style += `padding-left: ${indent * INDENT_PADDING_PX_SIZE}px;`
    attrs[ATTRIBUTE_INDENT] = String(indent)
  }
  if (style) attrs.style = style

  return ['p', attrs, 0]
}

const getAttrs = dom => {
  const { lineHeight, textAlign, paddingLeft } = dom.style
  let align = dom.getAttribute('align') || textAlign || ''
  align = ALIGN_PATTERN.test(align) ? align : null

  let indent = parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10)

  if (!indent && paddingLeft) {
    indent = convertPaddingLeftToIndentValue(paddingLeft)
  }

  indent = indent || MIN_INDENT_LEVEL

  const lineSpacing = lineHeight || null

  return { align, indent, lineSpacing }
}

export const toParagraphDOM = toDOM
export const getParagraphNodeAttrs = getAttrs

export default class Paragraph extends Node {

  get name() {
    return 'paragraph'
  }

  get schema() {
    return {
      attrs: {
        align: { default: null },
        id: { default: null },
        indent: { default: null },
        lineSpacing: { default: null },
      },
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [{ tag: 'p', getAttrs }],
      toDOM,
    }
  }

  commands({
    type
  }) {
    return (attrs) => {
      return setBlockType(type, attrs)
    }
  }

}
