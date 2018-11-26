import { findParentNode } from 'prosemirror-utils'

export default function (state, type, attrs = {}) {
  const predicate = node => node.type === type
  const parent = findParentNode(predicate)(state.selection)

  if (!Object.keys(attrs).length || !parent) {
    return !!parent
  }
  if (type.name === 'heading') {
    return parent.node && parent.node.attrs && parent.node.attrs.level === attrs.level
  }
  return parent.node.hasMarkup(type, attrs)
}
