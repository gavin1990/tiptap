<template>
	<div class="toolbar_wrap">
		<div class="item" v-for="(item, index) in toolBar" :key="index">
			<div v-if="item.list && item.list.length" v-for="(sitem, sindex) in item.list" :class="'col ' + sitem.type" :title="sitem.name" :key="sindex">
				<template v-if="item.type === 'color'">
					<label class="label" :class="{active: (sitem.commandCode && isActive[sitem.commandCode] &&isActive[sitem.commandCode](sitem.attrs))}" @click="colorPickerHandle(sitem)">
						<i v-if="sitem.icon" :class="'iconfont ' + sitem.icon"></i>
						<span class="til" v-else>{{sitem.name}}</span>
					</label>
					<transition name="slide" mode="out-in">
						<div class="sel_picker" v-if="sitem.picker">
							<color-picker :color="markAttrs[sitem.selectAttrs]" :item="sitem" @picker="setColor"></color-picker>
						</div>
					</transition>
				</template>
				<template v-else>
					<tip-select v-if="sitem.list && sitem.list.length" :options="sitem || {}" :mark-attrs="markAttrs" :current="currentType" @active="activeSelect" :key="sindex" :commands="commands" :isActive="isActive" :editor="editor" :arrowDownIconHide="true">
						<label class="label" slot="name">
							<i :class="'iconfont ' + sitem.icon"></i>
						</label>
					</tip-select>
					<label class="label" v-else :class="{active: (sitem.commandCode && isActive[sitem.commandCode] &&isActive[sitem.commandCode](sitem.attrs))}" @click="commandHandle(sitem)">
						<i v-if="sitem.icon" :class="'iconfont ' + sitem.icon"></i>
						<span class="til" v-else>{{sitem.name}}</span>
					</label>
				</template>
			</div>
		</div>
		<m-dialog ref="insertDialog" :title="dialogTitle" className="normal" :confirm="true" :layoutTrigger="true" @submit="dialogSubmit">
      <div slot="content">
        <template v-if="dialogType === 'image'">
          <image-tabs ref="imageTabs" @image="imageCommand" :attrs="selectedNode.node && selectedNode.node.attrs" :editor="editor"></image-tabs>
        </template>
      </div>
    </m-dialog>
	</div>
</template>

<script>
import { findSelectedNodeOfType } from 'prosemirror-utils'
import tipSelect from './Components/tip.select'
import colorPicker from './Components/color.picker'
import mDialog from './Components/dialog'
import imageTabs from './Components/image.tabs'
import { domClickHandle } from './utils'
export default {
	props: ['commands', 'isActive', 'editor', 'getMarkAttrs'],
	data () {
		const FONT_PX_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 48, 60, 72, 90]
		const LINE_SPACING_VALUES = ['100%', '115%', '150%', '200%', '300%', '400%', '500%']
		const HEADING_LEVEL = [1, 2, 3, 4, 5, 6]
		const FONT_TYPE_NAMES = [
			// SERIF
			'Arial',
			'Arial Black',
			'Georgia',
			'Tahoma',
			'Times New Roman',
			'Times',
			'Verdana',
			// MONOSPACE
			'Courier New',
			'Lucida Console',
			'Monaco',
			'monospace',
		]
		const FONT_PX_SIZE_COMMANDS = FONT_PX_SIZES.reduce((cmd, size) => {
			cmd.push({
				name: `${size}px`,
				command: this.commands.font_size,
				active: size,
				attrs: { px: size }
			})
			return cmd
		}, [])
		const LINE_SPACING_COMMANDS = LINE_SPACING_VALUES.reduce((cmd, value) => {
			cmd.push({
				name: `${value}`,
				command: this.commands.line_spacing,
				active: value,
				attrs: { lineSpacing: `${value}` }
			})
			return cmd
		}, [{
			name: 'Default',
			command: this.commands.line_spacing,
			active: '',
			attrs: { lineSpacing: '' }
		}])
		const FONT_TYPE_COMMANDS = FONT_TYPE_NAMES.reduce((cmd, name) => {
			cmd.push({
				name: `${name}`,
				command: this.commands.font_family,
				active: name,
				attrs: { name: name }
			})
			return cmd
		}, [])
		const HEADING_LEVEL_COMMANDS = HEADING_LEVEL.reduce((cmd, level) => {
			cmd.push({
				name: `Heading ${level}`,
				attrs: { level: level },
				commandCode: 'heading'
			})
			return cmd
		}, [{
			name: 'Paragraph',
			commandCode: 'paragraph'
		}])
		return {
			currentType: '',
      dialogTitle: 'Insert / Edit Image',
      dialogType: '',
      imageObj: '',
      selectedNode: {},
			markAttrs: {
				px: '',
				name: '',
				lineSpacing: '',
				background: '',
				color: ''
			},
			toolBar: [
				{
					group: 'Edit',
					list: [
						{
							name: 'Undo',
							command: this.commands.undo,
							icon: 'icon-undo'
						},
						{
							name: 'Redo',
							command: this.commands.redo,
							icon: 'icon-redo'
						}
					]
				},
				{
					group: 'Format',
					list: [
						{
							name: 'Bold',
							commandCode: 'bold',
							icon: 'icon-bold'
						},
						{
							name: 'Italic',
							commandCode: 'italic',
							icon: 'icon-italic'
						},
						{
							name: 'Strike',
							commandCode: 'strike',
							icon: 'icon-strike-through'
						},
						{
							name: 'Underline',
							commandCode: 'underline',
							icon: 'icon-underline'
						},
						{
							name: 'Superscript',
							commandCode: 'sup',
							icon: 'icon-superscript'
						},
						{
							name: 'Subscript',
							commandCode: 'sub',
							icon: 'icon-subscript'
						}
					]
				},
				{
					group: 'Heading',
					list: [
						{
							type: 'heading',
							select: true,
							list: HEADING_LEVEL_COMMANDS
						}
					]
				},
				{
					group: 'FontSize',
					list: [
						{
							type: 'fontSize',
							select: true,
							selectAttrs: 'px',
							selectExtend: 'px',
							list: FONT_PX_SIZE_COMMANDS
						}
					]
				},
				{
					group: 'FontFamily',
					list: [
						{
							type: 'fontFamily',
							select: true,
							selectAttrs: 'name',
							selectExtend: '',
							list: FONT_TYPE_COMMANDS
						}
					]
				},
				{
					group: 'Color',
					type: 'color',
					list: [
						{
							name: 'Text Color',
							type: 'text_color',
							command: this.commands.text_color,
							picker: false,
							attrsName: 'color',
							selectAttrs: 'color',
							icon: 'icon-text-color'
						},
						{
							name: 'Text Background Color',
							type: 'text_background_color',
							command: this.commands.text_background_color,
							picker: false,
							attrsName: 'background',
							selectAttrs: 'background',
							icon: 'icon-background-color'
						}
					]
				},
        {
          group: 'Insert',
          list: [
            {
              name: 'Image',
              commandCode: 'image',
              commandAfterClose: true,
              icon: 'icon-image'
            },
            {
              name: 'Link',
              commandCode: 'hr',
              icon: 'icon-link'
            },
            {
              name: 'Horizontal Line',
              commandCode: 'hr',
              icon: 'icon-horizontal'
            }
          ]
        },
				{
					group: 'LineSpacing',
					list: [
						{
							type: 'lineSpacing',
							icon: 'icon-lineheight',
							selectAttrs: 'lineSpacing',
							list: LINE_SPACING_COMMANDS
						}
					]
				},
				{
					group: 'AlignText',
					list: [
						{
							name: 'Align Left',
							command: this.commands.align,
							attrs: { align: 'left' },
							icon: 'icon-alignleft'
						},
						{
							name: 'Align Center',
							command: this.commands.align,
							attrs: { align: 'center' },
							icon: 'icon-align-center'
						},
						{
							name: 'Align Right',
							command: this.commands.align,
							attrs: { align: 'right' },
							icon: 'icon-align-right'
						}
					]
				},
				{
					group: 'Block',
					list: [
						{
							name: 'Code Inline',
							commandCode: 'code',
							icon: 'icon-code'
						},
						{
							name: 'Code Block',
							commandCode: 'code_block',
							icon: 'icon-code-block'
						},
						{
							name: 'Blockquote',
							commandCode: 'blockquote',
							icon: 'icon-blockquote'
						}
					]
				},
				{
					group: 'List',
					list: [
						{
							name: 'Bullet List',
							commandCode: 'bullet_list',
							icon: 'icon-bullet-list'
						},
						{
							name: 'Ordered List',
							commandCode: 'ordered_list',
							icon: 'icon-numbered-list'
						},
						{
							name: 'Increase Indent',
							command: this.commands.indent,
							attrs: { type: 'increase' },
							icon: 'icon-indent-right'
						},
						{
							name: 'Decrease Indent',
							command: this.commands.indent,
							attrs: { type: 'decrease' },
							icon: 'icon-indent-left'
						}
					]
				},
				{
					group: 'Format Clear',
					list: [
						{
							type: 'formatClear',
							icon: 'icon-format-clear',
							command: this.commands.marks_clear
						}
					]
				}
			]
		}
	},
	components: {
		tipSelect,
		colorPicker,
		mDialog,
		imageTabs
	},
	methods: {
		imageCommand (image) {
      this.imageObj = image
    },
		commandHandle (item) {
			if (item.command) return item.command(item.attrs)
			if (item.commandCode) {
				if (item.commandCode === 'image') {
					const selectedNode = this.getSelectionAttrs(item.commandCode)
					this.selectedNode = selectedNode || {}
					this.dialogType = 'image'
					this.$refs.insertDialog.open()
				} else {
					return this.commands[item.commandCode](item.attrs)
				}
			}
		},
		getSelectionAttrs (type) {
      const { selection } = this.editor.state
      const nodeType = this.editor.schema.nodes[type]
      return findSelectedNodeOfType(nodeType)(selection)
    },
		colorPickerHandle (item) {
			domClickHandle(item.type, _ => {
				item.picker = false
			})
			return item.picker = !item.picker
		},
		setColor (color, item) {
			item.attrs = item.attrs || {}
			if (color && color.hex8) item.attrs[item.attrsName] = color.hex8
			if (item.command) return item.command(item.attrs)
			if (item.commandCode) {
				return this.commands[item.commandCode](item.attrs)
			}
		},
		activeSelect (type) {
			this.currentType = type
		},
    dialogSubmit (data) {
      const _this = this
      if (_this.dialogType === 'image') {
        if (_this.imageObj) {
          if (_this.imageObj.type === 'Upload') {
            const filesList = _this.$refs.imageTabs.getUploadFiles()
            if (filesList && filesList.length) {
              filesList.forEach(item => {
                let image = {
                  src: item,
                  title: '',
                  alt: '',
                  width: '',
                  height: ''
                }
                _this.commands.image(image)
              })
            }
          } else if (_this.imageObj.type === 'General') {
            if (_this.imageObj.src) _this.commands.image(_this.imageObj)
          }
        }
      }
    }
	},
	watch: {
		getMarkAttrs (val) {
			this.markAttrs.px = val('font_size') && val('font_size').px ? val('font_size').px : ''
			this.markAttrs.name = val('font_family') && val('font_family').name ? val('font_family').name : ''
			this.markAttrs.color = val('text_color') && val('text_color').color ? val('text_color').color : ''
			this.markAttrs.background = val('text_background_color') && val('text_background_color').background ? val('text_background_color').background : ''
		}
	}
}
</script>

<style lang="scss" scoped>
.toolbar_wrap {
  padding: 5px 0;
  .item {
    display: inline-block;
    border-right: 1px solid #eee;
    &:last-child {
      border-right: none;
    }
    .col {
      display: inline-flex;
      position: relative;
      .label {
        color: #000;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        background: transparent;
        cursor: pointer;
        &.active {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      .til {
        font-size: 14px;
        font-weight: 500;
      }
      .like_sel {
        .sel_option {
          top: 20px;
        }
      }
      .sel_picker {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 999;
        .vc-sketch {
          border-radius: 0;
        }
      }
    }
  }
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-10%);
  opacity: 0;
}
.slide-leave {
  transform: translateY(0);
  opacity: 1;
}
.slide-enter-active {
  transition: all 0.3s cubic-bezier(0.83, -0.55, 0.38, 1.75);
  transition-delay: 50ms;
}
.slide-leave-active {
  transition: all 0.2s ease-in-out;
  transition-delay: 50ms;
}
</style>