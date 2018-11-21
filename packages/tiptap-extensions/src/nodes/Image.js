import { Node, Plugin } from 'tiptap'
import { findSelectedNodeOfType } from 'prosemirror-utils'

export default class Image extends Node {

  get name() {
    return 'image'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        width: {
          default: null,
        },
        height: {
          default: null,
        },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            width: dom.getAttribute('width'),
            heigth: dom.getAttribute('heigth'),
          }),
        },
      ],
      toDOM: node => ['img', node.attrs],
    }
  }

  commands({ type, schema }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const nodeType = schema.nodes.image
      const selectedNode = findSelectedNodeOfType(nodeType)(selection)
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      let transaction
      if (selectedNode && selectedNode.node) {
        transaction = state.tr.replaceSelectionWith(nodeType.createAndFill(attrs))
      } else {
        const node = type.create(attrs)
        transaction = state.tr.insert(position, node)
      }
      dispatch(transaction)
    }
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer
              && event.dataTransfer.files
              && event.dataTransfer.files.length

              if (!hasFiles) {
                return
              }

              const images = Array
                .from(event.dataTransfer.files)
                .filter(file => (/image/i).test(file.type))

              if (images.length === 0) {
                return
              }

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

              images.forEach(image => {
                const reader = new FileReader()

                reader.onload = readerEvent => {
                  const node = schema.nodes.image.create({
                    src: readerEvent.target.result,
                  })
                  const transaction = view.state.tr.insert(coordinates.pos, node)
                  view.dispatch(transaction)
                }
                reader.readAsDataURL(image)
              })
            },
          },
        },
      }),
    ]
  }

}
