import { Extension } from 'tiptap'
import { MIN_INDENT_LEVEL, MAX_INDENT_LEVEL } from '../nodes/Paragraph'

function getIndent (indent, type) {
	let indentment
  if (type === 'decrease') {
  	if (!indent) {
		 	indent = null
		} else {
			indentment = indent - 1
		}
  } else if (type === 'increase') {
  	indentment = indent + 1
  }
  return indentment
}

export function setTextIndent ( tr, schema, indentAttrs) {
  const {selection, doc} = tr
  if (!selection || !doc) {
    return tr
  }

  const {from, to, empty} = selection
  const {nodes} = schema

  const blockquote = nodes['blockquote']
  const listItem = nodes['list_item']
  const heading = nodes['heading']
  const paragraph = nodes['paragraph']

  const tasks = []

  const allowedNodeTypes = new Set([
    blockquote,
    heading,
    listItem,
    paragraph,
  ])

  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type
    const indent = node.attrs.indent || null
    let indentment = getIndent(indent, indentAttrs.type)
    if (indentment >= MIN_INDENT_LEVEL && indentment <= MAX_INDENT_LEVEL && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node,
        pos,
        nodeType,
      })
    }
    return true
  })

  if (!tasks.length) {
    return tr
  }

  tasks.forEach(job => {
    const {node, pos, nodeType} = job
    let attrs = node.attrs
    let indentment = getIndent(attrs.indent, indentAttrs.type)
    if (indentment) {
      attrs = {
        ...attrs,
        indent: indentment,
      }
    } else {
      attrs = {
        ...attrs,
        indent: null,
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

export default class Indent extends Extension {

  get name() {
    return 'indent'
  }

  commands({ schema }) {
    return attrs => (state, dispatch) => {
	    const {selection} = state
    	const tr = setTextIndent(state.tr.setSelection(selection), schema, attrs)
    	if (tr.docChanged) {
	      dispatch && dispatch(tr)
	    }
    }
  }

}
