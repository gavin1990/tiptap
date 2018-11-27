import {
  Mark
} from 'tiptap'
import {
  toggleMark,
  markInputRule,
} from 'tiptap-commands'
import {
  markIsActive
}
from 'tiptap-utils'

function toogleMarkType(type, toggletype, attrs = {}) {
  return (state, dispatch, view) => {
    const isActive = markIsActive(state, toggletype, attrs)
    if (isActive) {
      const { from, to } = state.selection
      Object.assign(state, state.apply(state.tr.removeMark(from, to, toggletype)))
    }

    return toggleMark(type, attrs)(state, dispatch, view)
  }
}

export default class Superscript extends Mark {

  get name() {
    return 'sup'
  }

  get schema() {
    return {
      parseDOM: [{
          tag: 'sup'
        },
        {
          style: 'vertical-align=sup'
        },
      ],
      toDOM: () => ['sup', 0],
    }
  }

  commands({
    type,
    schema
  }) {
    return attrs => (state, dispatch) => {
      return toogleMarkType(type, schema.marks.sub, attrs)(state, dispatch)
    }
  }

  inputRules({
    type
  }) {
    return [
      markInputRule(/(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)$/, type),
    ]
  }

}
