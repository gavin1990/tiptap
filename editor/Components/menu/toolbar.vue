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
					<tip-select v-if="sitem.list && sitem.list.length" :options="sitem || {}" :mark-attrs="markAttrs" :current="currentType" @active="activeSelect" :key="sindex" :commands="commands" :isActive="isActive" :editor="editor" :arrowDownIconHide="true" bar="tool">
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
				<template v-else-if="dialogType === 'link'">
					<e-form :schema="linkSchema" v-model="linkObj" @submit="dialogSubmit"></e-form>
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
import eForm from './Components/form'
import { domClickHandle, createObjFromSchema } from './utils'
import { FONT_PX_SIZE_COMMANDS, LINE_SPACING_COMMANDS, FONT_TYPE_COMMANDS, HEADING_LEVEL_COMMANDS, FORMAT_COMMANDS_LIST, INSERT_BAR_LIST, TEXT_COLOR_COMMAMD_LIST, TEXT_ALIGN_COMMAMD_LIST, LIST_COMMANDS, BLOCK_COMMANDS_LIST, EDIT_COMMANDS_LIST } from './config'
export default {
	props: ['commands', 'isActive', 'editor', 'focused', 'getMarkAttrs'],
	data () {
		const linkSchema = [
			{
				name: 'href',
				label: 'Link'
			}
		]
		let linkObj = createObjFromSchema(linkSchema)
		return {
			currentType: '',
      dialogTitle: 'Insert / Edit Image',
      dialogType: '',
      imageObj: '',
			selectedNode: {},
			linkSchema,
			linkObj,
			markAttrs: {
				px: '',
				name: '',
				lineSpacing: '',
				background: '',
				color: '',
				href: ''
			},
			toolBar: [
				{
					group: 'Edit',
					list: EDIT_COMMANDS_LIST(this.commands)
				},
        {
          group: 'Insert',
          list: INSERT_BAR_LIST
        },
				{
					group: 'Format',
					list: FORMAT_COMMANDS_LIST
				},
				{
					group: 'Heading',
					list: [
						{
							type: 'heading',
							select: true,
							list: HEADING_LEVEL_COMMANDS(true)
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
							list: FONT_PX_SIZE_COMMANDS(this.commands)
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
							list: FONT_TYPE_COMMANDS(this.commands)
						}
					]
				},
				{
					group: 'Color',
					type: 'color',
					list: TEXT_COLOR_COMMAMD_LIST(this.commands)
				},
				{
					group: 'LineSpacing',
					list: [
						{
							type: 'lineSpacing',
							icon: 'icon-lineheight',
							selectAttrs: 'lineSpacing',
							list: LINE_SPACING_COMMANDS(this.commands)
						}
					]
				},
				{
					group: 'AlignText',
					list: TEXT_ALIGN_COMMAMD_LIST(this.commands)
				},
				{
					group: 'Block',
					list: BLOCK_COMMANDS_LIST
				},
				{
					group: 'List',
					list: LIST_COMMANDS(this.commands)
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
		imageTabs,
		eForm
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
					this.dialogTitle = 'Insert / Edit Image'
					this.dialogType = 'image'
					this.$refs.insertDialog.open()
				} else if (item.commandCode === 'link') {
					if (!this.isActive.link()) {
						this.dialogTitle = 'Insert / Edit Link'
						this.dialogType = 'link'
						this.$refs.insertDialog.open()
					}
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
			this.$refs.insertDialog.close()
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
      } else if (_this.dialogType === 'link') {
				if (_this.linkObj && _this.linkObj.href) {
					_this.commands.link(_this.linkObj)
					_this.linkObj = createObjFromSchema(_this.linkSchema)
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
			this.markAttrs.href = val('link') && val('link').href ? val('link').href : ''
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
				.iconfont{
					color: #444;
				}
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