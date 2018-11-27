import { Extension } from 'tiptap'
import { Fragment } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { nodeIsActive } from 'tiptap-utils'
import { MIN_INDENT_LEVEL, MAX_INDENT_LEVEL } from '../nodes/Paragraph'

function getIndent(indent, type) {
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

function setNodeIndentMarkup(tr, pos, indentAttrs) {
  if (!tr.doc) {
    return tr
  }
  const node = tr.doc.nodeAt(pos)
  const nodeType = node.type
  let attrs = node.attrs
  const indentment = getIndent(attrs.indent, indentAttrs.type)
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
  return tr.setNodeMarkup(pos, nodeType, attrs, node.marks)
}

function isListNode(nodes, nodeType) {
  const bulletList = nodes.bullet_list
  const orderedList = nodes.ordered_list
  const allowedNodeTypes = new Set([bulletList, orderedList])
  if (allowedNodeTypes.has(nodeType)) {
    return true
  }
  return false
}

function isListNodeActive(state, nodes) {
  const bulletList = nodes.bullet_list
  const orderedList = nodes.ordered_list
  if (nodeIsActive(state, bulletList, nodes.attrs) || nodeIsActive(state, orderedList, nodes.attrs)) {
    return true
  }
  return false
}

function setListNodeIndent(tr, schema, pos, indentAttrs) {
  const listItem = schema.nodes.list_item
  if (!listItem) {
    return tr
  }

  const { doc, selection } = tr
  if (!doc) {
    return tr
  }

  const listNode = doc.nodeAt(pos)
  if (!listNode) {
    return tr
  }

  let attrs = listNode.attrs
  const indentment = getIndent(attrs.indent, indentAttrs.type)
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
  const { from, to } = selection
  if (from <= pos && to >= pos + listNode.nodeSize) {
    return setNodeIndentMarkup(tr, pos, indentAttrs)
  }

  const listNodeType = listNode.type

  // listNode is partially selected.
  const itemsBefore = []
  const itemsSelected = []
  const itemsAfter = []

  doc.nodesBetween(pos, pos + listNode.nodeSize, (itemNode, itemPos) => {
    if (itemNode.type === listNodeType) {
      return true
    }

    if (itemNode.type === listItem) {
      const listItemNode = listItem.create(itemNode.attrs, itemNode.content, itemNode.marks)
      if (itemPos + itemNode.nodeSize <= from) {
        itemsBefore.push(listItemNode)
      } else if (itemPos > to) {
        itemsAfter.push(listItemNode)
      } else {
        itemsSelected.push(listItemNode)
      }
      return false
    }

    return true
  })

  tr = tr.delete(pos, pos + listNode.nodeSize)
  if (itemsAfter.length) {
    const listNodeNew = listNodeType.create(listNode.attrs, Fragment.from(itemsAfter))
    tr = tr.insert(pos, Fragment.from(listNodeNew))
    tr = mergeSiblingLists(tr, pos)
  }

  if (itemsSelected.length) {
    const listNodeNew = listNodeType.create(attrs, Fragment.from(itemsSelected))
    tr = tr.insert(pos, Fragment.from(listNodeNew))
    tr = mergeSiblingLists(tr, pos)
  }

  if (itemsBefore.length) {
    const listNodeNew = listNodeType.create(listNode.attrs, Fragment.from(itemsBefore))
    tr = tr.insert(pos, Fragment.from(listNodeNew))
    tr = mergeSiblingLists(tr, pos)
  }
  return tr
}

function mergeSiblingLists(tr, listNodePos) {
  let listNode = tr.doc.nodeAt(listNodePos)
  if (!listNode) {
    return tr
  }
  const listNodeType = listNode.type
  const indent = listNode.attrs.indent
  let fromPos = listNodePos
  let toPos = listNodePos + listNode.nodeSize
  let $fromPos = tr.doc.resolve(fromPos)
  let $toPos = tr.doc.resolve(toPos)
  if (
    $fromPos.nodeBefore
    && $fromPos.nodeBefore.type === listNodeType
    && $fromPos.nodeBefore.attrs.indent === indent
  ) {
    const beforeFromPos = fromPos - $fromPos.nodeBefore.nodeSize
    tr = tr.delete(fromPos, toPos)
    tr = tr.insert(fromPos - 1, listNode.content)

    listNode = tr.doc.nodeAt(beforeFromPos)
    fromPos = beforeFromPos
    toPos = beforeFromPos + listNode.nodeSize
    $fromPos = tr.doc.resolve(fromPos)
    $toPos = tr.doc.resolve(toPos)
  }

  if (
    $toPos.nodeAfter
    && $toPos.nodeAfter.type === listNodeType
    && $toPos.nodeAfter.attrs.indent === indent
  ) {
    tr = tr.delete(fromPos, toPos)
    tr = tr.insert(fromPos + 1, listNode.content)
  }
  return tr
}

function transformAndPreserveTextSelection(tr, schema, fn) {
  const { selection, doc } = tr
  if (!selection || !doc) {
    return tr
  }

  if (!(selection instanceof TextSelection)) {
    return tr
  }

  const { from, to } = selection

  // Mark current selection so that we could resume the selection later
  // after changing the whole list.
  let selectionExpanded
  if (from === to) {
    if (from === 0) {
      return tr
    }
    // Selection is collapsed, create a temnporary selection that the marks can
    // be applied to.
    selectionExpanded = TextSelection.create(doc, from - 1, to)
    tr = tr.setSelection(selectionExpanded)
  }

  // This is an unique ID (by reference).
  const id = {}
  const findMark = mark => mark.attrs.id === id
  const findMarkRange = () => {
    let markFrom = 0
    let markTo = 0
    tr.doc.descendants((node, pos) => {
      if (node.marks && node.marks.find(findMark)) {
        markFrom = markFrom === 0 ? pos : markFrom
        markTo = pos + node.nodeSize
      }
      return true
    })
    return {
      from: markFrom,
      to: markTo,
    }
  }
  tr = fn({ tr, schema })

  const markRange = findMarkRange()
  const selectionRange = {
    from: selectionExpanded ? markRange.from + 1 : markRange.from,
    to: markRange.to,
  }

  tr = tr.setSelection(TextSelection.create(tr.doc, selectionRange.from, selectionRange.to))

  return tr
}

export function updateIndentLevel(tr, type, schema, state, indentAttrs) {
  const { selection, doc } = tr
  if (!selection || !doc) {
    return tr
  }

  const { from, to } = selection
  const { nodes } = schema
  const listNodePoses = []

  const blockquote = nodes.blockquote
  const heading = nodes.heading
  const paragraph = nodes.paragraph

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type
    const indent = node.attrs.indent || null
    const indentment = getIndent(indent, indentAttrs.type)
    if (indentment < MIN_INDENT_LEVEL || indentment > MAX_INDENT_LEVEL) {
      return tr
    }
    if (nodeType === paragraph || nodeType === heading || nodeType === blockquote) {
      tr = setNodeIndentMarkup(tr, pos, indentAttrs)
      return false
    } else if (isListNode(nodes, nodeType)) {
      listNodePoses.push(pos)
      return false
    }
    return true
    // if (isListNodeActive(state, nodes) && isListNode(nodes, nodeType)) {
    //   listNodePoses.push(pos)
    // } else {
    //   if (nodeType === paragraph || nodeType === heading || nodeType === blockquote) {
    //     tr = setNodeIndentMarkup(tr, pos, indentAttrs)
    //     return tr
    //   }
    // }
  })

  if (!listNodePoses.length) {
    return tr
  }

  tr = transformAndPreserveTextSelection(tr, schema, memo => {
    let tr2 = memo.tr
    listNodePoses
      .sort()
      .reverse()
      .forEach(pos => {
        tr2 = setListNodeIndent(tr2, memo.schema, pos, indentAttrs)
      })
    return tr2
  })

  return tr
}

export default class Indent extends Extension {
  get name() {
    return 'indent'
  }

  commands({ type, schema }) {
    return attrs => (state, dispatch) => {
      let { selection, tr, schema } = state
      tr = tr.setSelection(selection)
      tr = updateIndentLevel(tr, type, schema, state, attrs)
      if (tr.docChanged) {
        dispatch && dispatch(tr)
        return true
      }
      return false
    }
  }
}
