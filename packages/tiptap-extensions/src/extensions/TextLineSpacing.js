import { Extension } from 'tiptap'

export function setTextLineSpacing ( tr, schema, lineSpacing) {
  const {selection, doc} = tr
  if (!selection || !doc) {
    return tr
  }
  const {from, to, empty} = selection

  const paragraph = schema.nodes['paragraph']
  const heading = schema.nodes['heading']
  const listItem = schema.nodes['list_item']
  if (!paragraph && !heading && !listItem) {
    return tr
  }

  const tasks = []
  const lineSpacingValue = lineSpacing || null

  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type
    if (
      nodeType === paragraph ||
      nodeType === heading ||
      nodeType === listItem
    ) {
      const lineSpacing = node.attrs.lineSpacing || null
      if (lineSpacing !== lineSpacingValue) {
        tasks.push({
          node,
          pos,
          nodeType,
        })
      }
      return (nodeType === listItem) ? true : false
    }
    return true
  })

  if (!tasks.length) {
    return tr
  }

  tasks.forEach(job => {
    const {node, pos, nodeType} = job
    let attrs = node.attrs
    if (lineSpacingValue) {
      attrs = {
        ...attrs,
        lineSpacing: lineSpacingValue,
      }
    } else {
      attrs = {
        ...attrs,
        lineSpacing: null,
      }
    }
    tr = tr.setNodeMarkup(
      pos,
      nodeType,
      attrs,
      node.marks,
    )
  })

  return tr
}

export default class LineSpacing extends Extension {

  get name() {
    return 'line_spacing'
  }

  commands({ schema }) {
    return attrs => (state, dispatch) => {
    	const {selection} = state
    	const tr = setTextLineSpacing(state.tr.setSelection(selection), schema, attrs.lineSpacing)
    	if (tr.docChanged) {
	      dispatch && dispatch(tr)
	    }
    }
  }

}
