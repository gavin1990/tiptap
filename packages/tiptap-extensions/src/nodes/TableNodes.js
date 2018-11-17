import { tableNodes } from 'prosemirror-tables'

const Table = tableNodes({
	tableGroup: 'block',
	cellContent: 'block+',
	cellAttributes: {
		background: {
			default: null,
			getFromDOM(dom) { return dom.style.backgroundColor || null },
			setDOMAttr(value, attrs) {
				attrs.style = attrs.style || {}
				if (value) attrs.style['background-color'] = value
			},
		},
	},
})
export default Table
