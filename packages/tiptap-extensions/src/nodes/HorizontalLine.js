import {
  Node
} from 'tiptap'
import {
  Fragment
} from 'prosemirror-model'

function insertHorizontalRule(
  tr,
  schema,
) {
  const {
    selection
  } = tr
  if (!selection) {
    return tr
  }
  const {
    from,
    to
  } = selection
  if (from !== to) {
    return tr
  }

  const horizontalRule = schema.nodes['hr']
  if (!horizontalRule) {
    return tr
  }

  const node = horizontalRule.create({}, null, null)
  const frag = Fragment.from(node)
  tr = tr.insert(from, frag)
  return tr
}


export default class HorizontalLine extends Node {

  get name() {
    return 'hr'
  }

  get schema() {
    return {
      group: 'block',
      parseDOM: [{
        tag: 'hr'
      }],
      toDOM: () => ['hr'],
    }
  }

  commands({
    schema
  }) {
    return attrs => (state, dispatch) => {
      const {
        selection,
        schema
      } = state
      const tr = insertHorizontalRule(
        state.tr.setSelection(selection),
        schema,
      )
      if (tr.docChanged) {
        dispatch && dispatch(tr)
        return true
      } else {
        return false
      }
    }
  }

}
