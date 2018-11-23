<template>
	<div class="toolbar_wrap">
		<div class="item" v-for="(item, index) in toolBar" :key="index">
			<div class="col" v-if="item.list && item.list.length" v-for="(sitem, sindex) in item.list" :title="sitem.name" :key="sindex">
				<tip-select v-if="sitem.list && sitem.list.length" :name="sitem.name" :type="sitem.type" :current="currentType" @active="activeSelect" :key="sindex" :list="sitem.list" :commands="commands" :isActive="isActive" :editor="editor" :arrowDownIconHide="true">
					<label class="label" slot="name"><i :class="'iconfont ' + sitem.icon"></i></label>
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
		props: ['commands', 'isActive', 'editor'],
		data () {
			return {
				currentType: '',
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
						group: 'AlignText',
						list: [
							{
								name: 'Align Left',
			          command: this.commands.align,
			          attrs: {align: 'left'},
              	icon: 'icon-alignleft'
							},
							{
								name: 'Align Center',
			          command: this.commands.align,
			          attrs: {align: 'center'},
              	icon: 'icon-align-center'
							},
							{
								name: 'Align Right',
			          command: this.commands.align,
			          attrs: {align: 'right'},
              	icon: 'icon-align-right'
							}
						]
					},
					{
						group: 'LineSpacing',
						list: [
							{
								type: 'lineSpacing',
              	icon: 'icon-lineheight',
              	list: [
              		{
              			name: 'Default',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: ''}
              		},
              		{
              			name: '100%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '100%'}
              		},
              		{
              			name: '115%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '115%'}
              		},
              		{
              			name: '150%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '150%'}
              		},
              		{
              			name: '200%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '200%'}
              		},
              		{
              			name: '300%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '300%'}
              		},
              		{
              			name: '400%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '400%'}
              		},
              		{
              			name: '500%',
					          command: this.commands.line_spacing,
					          attrs: {lineSpacing: '500%'}
              		}
              	]
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
			          attrs: {type: 'increase'},
              	icon: 'icon-indent-right'
							},
							{
								name: 'Decrease Indent',
			          command: this.commands.indent,
			          attrs: {type: 'decrease'},
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
		}
	}
</script>

<style lang="scss" scoped>
	.toolbar_wrap{
		padding: 5px 0;
		.item{
			display: inline-block;
			border-right: 1px solid #eee;
			&:last-child {
				border-right: none;
			}
			.col{
				display: inline-flex;
		    margin-right: 0.2rem;
		    .label{
		    	color: #000;
					padding: 0 10px;
					height: 30px;
					line-height: 30px;
					border-radius: 3px;
					background: transparent;
					cursor: pointer;
					&.active{
			    	background-color: rgba(0, 0, 0, 0.1);
			    }
		    }
		    .til{
		    	font-size: 14px;
		    	font-weight: 500;
		    }
		    .like_sel{
		    	.sel_option{top: 20px}
		    }
			}
		}
	}
</style>