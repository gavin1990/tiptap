import {
  Extension
} from 'tiptap'
import {
  setTextAlign
} from './TextAlign'

const FORMAT_MARK_NAMES = [
  'italic',
  'font_size',
  'font_family',
  'strike',
  'bold',
  'link',
  'text_color',
  'line_spacing',
  'underline',
];

function clearMarks(tr, schema) {
  const {
    doc,
    selection
  } = tr
  if (!selection || !doc) {
    return tr
  }
  const {
    from,
    to,
    empty
  } = selection
  if (empty) {
    return tr
  }

  const markTypesToRemove =
    new Set(FORMAT_MARK_NAMES.map(n => schema.marks[n]).filter(Boolean))

  if (!markTypesToRemove.size) {
    return tr
  }

  const tasks = []
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks && node.marks.length) {
      node.marks.some(mark => {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({
            node,
            pos,
            mark
          })
        }
      })
      return true
    }
    return true
  })
  if (!tasks.length) {
    return tr
  }

  tasks.forEach(job => {
    const {
      node,
      mark,
      pos
    } = job
    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type)
  })

  // It should also clear text alignment.
  tr = setTextAlign(tr, schema, null)
  return tr
}

export default class MarksClear extends Extension {

  get name() {
    return 'marks_clear'
  }

  commands({
    schema
  }) {
    return attrs => (state, dispatch) => {
      const tr = clearMarks(
        state.tr.setSelection(state.selection),
        state.schema,
      )
      if (dispatch && tr.docChanged) {
        dispatch(tr)
      }
    }
  }

}
