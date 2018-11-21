<template>
	<div class="toolbar_wrap">
		<div class="item" v-for="(item, index) in toolBar" :key="index">
			<div class="col" v-if="item.list && item.list.length" v-for="(sitem, sindex) in item.list" :class="{active: (sitem.commandCode && isActive[sitem.commandCode](sitem.attrs))}" :title="sitem.name" :key="sindex" @click="commandHandle(sitem)">
				<i v-if="sitem.icon" :class="'iconfont ' + sitem.icon"></i>
				<span class="til" v-else>{{sitem.name}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['commands', 'isActive', 'editor'],
		data () {
			return {
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
							},
							{
								name: 'Paragraph',
			          commandCode: 'paragraph',
              	icon: 'icon-paragraph'
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
								name: 'Decrease Indent',
			          tiptapCommand: 'ordered_list',
              	icon: 'icon-indent-left'
							},
							{
								name: 'Increase Indent',
			          commandCode: 'ordered_list',
              	icon: 'icon-indent-right'
							}
						]
					}
				]
			}
		},
		methods: {
			commandHandle (item) {
				if (item.command) return item.command()
				if (item.commandCode) {
					return this.commands[item.commandCode](item.attrs)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.toolbar_wrap{
		.item{
			display: inline-block;
			border-right: 1px solid #eee;
			padding: 0 5px 2px;
			&:last-child {
				border-right: none;
			}
			.col{
				display: inline-flex;
		    background: transparent;
		    border: 0;
		    color: #000000;
		    padding: 0.2rem 0.5rem;
		    margin-right: 0.2rem;
		    border-radius: 3px;
		    cursor: pointer;
		    line-height: 16px;
		    .til{
		    	font-size: 14px;
		    	font-weight: 500;
		    }
		    &.active{
		    	background-color: rgba(0, 0, 0, 0.1);
		    }
			}
		}
	}
</style>