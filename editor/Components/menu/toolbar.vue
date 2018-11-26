<template>
	<div class="toolbar_wrap">
		<div class="item" v-for="(item, index) in toolBar" :key="index">
			<div class="col" v-if="item.list && item.list.length" v-for="(sitem, sindex) in item.list" :title="sitem.name" :key="sindex">
				<tip-select v-if="sitem.list && sitem.list.length" :options="sitem || {}" :mark-attrs="markAttrs" :current="currentType" @active="activeSelect" :key="sindex" :commands="commands" :isActive="isActive" :editor="editor" :arrowDownIconHide="true">
					<label class="label" slot="name">
						<i :class="'iconfont ' + sitem.icon"></i>
					</label>
				</tip-select>
				<label class="label" v-else :class="{active: (sitem.commandCode && isActive[sitem.commandCode] &&isActive[sitem.commandCode](sitem.attrs))}" @click="commandHandle(sitem)">
					<i v-if="sitem.icon" :class="'iconfont ' + sitem.icon"></i>
					<span class="til" v-else>{{sitem.name}}</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
import tipSelect from './Components/tip.select'
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
			markAttrs: {
				px: '',
				lineSpacing: '',
				name: ''
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
				}
			]
		}
	},
	components: {
		tipSelect
	},
	methods: {
		commandHandle (item) {
			if (item.command) return item.command(item.attrs)
			if (item.commandCode) {
				return this.commands[item.commandCode](item.attrs)
			}
		},
		activeSelect (type) {
			this.currentType = type
		},
	},
	watch: {
		getMarkAttrs (val) {
			this.markAttrs.px = val('font_size') && val('font_size').px ? val('font_size').px : ''
			this.markAttrs.name = val('font_family') && val('font_family').name ? val('font_family').name : ''
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
    }
  }
}
</style>