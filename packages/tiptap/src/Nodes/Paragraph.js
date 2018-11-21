import { setBlockType } from 'tiptap-commands'
import Node from '../Utils/Node'


export const INDENT_MARGIN_PT_SIZE = 36
export const MIN_INDENT_LEVEL = 0
export const MAX_INDENT_LEVEL = 7
export const ATTRIBUTE_INDENT = 'data-indent'
export const LINE_SPACING_VALUES = [
  '100%',
  '115%',
  '150%', // Default value.
  '200%',
]
const ALIGN_PATTERN = /(left|right|center|justify)/

const SIZE_PATTERN = /([\d\.]+)(px|pt)/i

export const PX_TO_PT_RATIO = 0.75292857
export const PT_TO_PX_RATIO = 1 / PX_TO_PT_RATIO

export const clamp = (min, val, max) => {
  if (val < min) {
    return min
  }
  if (val > max) {
    return max
  }
  return val
}

export const convertToCSSPTValue = styleValue => {
  const matches = styleValue.match(SIZE_PATTERN)
  if (!matches) {
    return 0
  }
  let value = parseFloat(matches[1])
  const unit = matches[2]
  if (!value || !unit) {
    return 0
  }
  if (unit === 'px') {
    value *= PX_TO_PT_RATIO
  }
  return value
}

export const convertMarginLeftToIndentValue = marginLeft => {
  const ptValue = convertToCSSPTValue(marginLeft)
  return clamp(
    MIN_INDENT_LEVEL,
    Math.floor(ptValue / INDENT_MARGIN_PT_SIZE),
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
  if (style) attrs.style = style

  if (indent) {
    attrs[ATTRIBUTE_INDENT] = String(indent)
  }

  return ['p', attrs, 0]
}

const getAttrs = dom => {
  const { lineHeight, textAlign, marginLeft } = dom.style
  let align = dom.getAttribute('align') || textAlign || ''
  align = ALIGN_PATTERN.test(align) ? align : null

  let indent = parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10)

  if (!indent && marginLeft) {
    indent = convertMarginLeftToIndentValue(marginLeft)
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

  commands({ type }) {
    return () => setBlockType(type)
  }

}
