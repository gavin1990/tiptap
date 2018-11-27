<template>
  <div class="tiptap_menu_bar">
    <template v-for="(item,index) in menuBar">
      <tip-select class="item" :options="item || {}" :current="currentType" @active="activeSelect" :key="index" :commands="commands" :isActive="isActive" :editor="editor" @command="itemCommand"></tip-select>
    </template>
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
import tipSelect from './Components/tip.select'
import mDialog from './Components/dialog'
import imageTabs from './Components/image.tabs'
export default {
  props: ['commands', 'isActive', 'editor'],
  data () {
    return {
      currentType: '',
      dialogTitle: 'Insert / Edit Image',
      dialogType: '',
      imageObj: '',
      selectedNode: {},
      menuBar: [
        {
          name: 'File',
          type: 'file',
          list: [
            {
              name: 'Print',
              icon: 'icon-print'
            }
          ]
        },
        {
          name: 'Edit',
          type: 'edit',
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
          name: 'Format',
          type: 'format',
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
						},
            {
              name: 'Code Inline',
              commandCode: 'code',
              icon: 'icon-code'
            },
            {
              name: 'Block',
              child: true,
              list: [
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
              name: 'Heading',
              child: true,
              list: [
                {
                  name: 'Heading 1',
                  attrs: { level: 1 },
                  commandCode: 'heading'
                },
                {
                  name: 'Heading 2',
                  attrs: { level: 2 },
                  commandCode: 'heading'
                },
                {
                  name: 'Heading 3',
                  attrs: { level: 3 },
                  commandCode: 'heading'
                },
                {
                  name: 'Heading 4',
                  attrs: { level: 4 },
                  commandCode: 'heading'
                },
                {
                  name: 'Heading 5',
                  attrs: { level: 5 },
                  commandCode: 'heading'
                },
                {
                  name: 'Heading 6',
                  attrs: { level: 6 },
                  commandCode: 'heading'
                }
              ]
            }
          ]
        },
        {
          name: 'Insert',
          type: 'insert',
          list: [
            {
              name: 'Table',
              commandCode: 'table',
              commandType: 'insertTable',
              child: true,
              icon: 'icon-inserttable'
            },
            {
              name: 'Image',
              commandCode: 'image',
              commandAfterClose: true,
              icon: 'icon-image'
            },
            {
              name: 'Template',
              icon: 'icon-template-copy'
            },
            {
              name: 'Horizontal Line',
              commandCode: 'hr',
              icon: 'icon-horizontal'
            }
          ]
        },
        {
          name: 'Table',
          type: 'table',
          list: [
            {
              name: 'Insert Table',
              commandCode: 'table',
              commandType: 'insertTable',
              child: true,
              icon: 'icon-inserttable'
            },
            {
              name: 'Delete Table',
              commandCode: 'table',
              commandType: 'deleteTable',
              icon: ''
            },
            {
              name: 'Row',
              child: true,
              list: [
                {
                  name: 'Add Row Before',
                  commandCode: 'table',
                  commandType: 'addRowBefore'
                },
                {
                  name: 'Add Row After',
                  commandCode: 'table',
                  commandType: 'addRowAfter'
                },
                {
                  name: 'Toggle Header Row',
                  commandCode: 'table',
                  commandType: 'toggleHeaderRow'
                },
                {
                  name: 'Delete Row',
                  commandCode: 'table',
                  commandType: 'deleteRow'
                }
              ]
            },
            {
              name: 'Col',
              child: true,
              list: [
                {
                  name: 'Add Column Before',
                  commandCode: 'table',
                  commandType: 'addColumnBefore'
                },
                {
                  name: 'Add Column After',
                  commandCode: 'table',
                  commandType: 'addColumnAfter'
                },
                {
                  name: 'Toggle Header Column',
                  commandCode: 'table',
                  commandType: 'toggleHeaderColumn'
                },
                {
                  name: 'Delete Column',
                  commandCode: 'table',
                  commandType: 'deleteColumn'
                }
              ]
            },
            {
              name: 'MergeCells',
              commandCode: 'table',
              commandType: 'mergeCells',
              icon: ''
            },
            {
              name: 'SplitCell',
              commandCode: 'table',
              commandType: 'splitCell',
              icon: ''
            },
            {
              name: 'SetCellBackground',
              commandCode: 'table',
              commandType: 'setCellBackground',
              child: true,
              picker: false,
              attrsName: 'color',
              type: 'color'
            },
            {
              name: 'RemoveCellBackground',
              commandCode: 'table',
              commandType: 'removeCellBackground',
              icon: ''
            },
            {
              name: 'VerticalAlignTop',
              commandCode: 'table',
              commandType: 'verticalAlignTop',
              icon: ''
            },
            {
              name: 'VerticalAlignMiddle',
              commandCode: 'table',
              commandType: 'verticalAlignMiddle',
              icon: ''
            },
            {
              name: 'VerticalAlignBottom',
              commandCode: 'table',
              commandType: 'verticalAlignBottom',
              icon: ''
            }
          ]
        }
      ]
    }
  },
  components: {
    tipSelect,
    mDialog,
    imageTabs
  },
  methods: {
    activeSelect (type) {
      this.currentType = type
    },
    itemCommand (type, selectedNode) {
      console.log(this.editor)
      this.selectedNode = selectedNode || {}
      this.dialogType = type
      this.$refs.insertDialog.open()
    },
    imageCommand (image) {
      this.imageObj = image
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
  }
}
</script>

<style lang="scss" scoped>
.tiptap_menu_bar {
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
  .item {
    display: inline-block;
    font-size: 14px;
    height: 35px;
    line-height: 35px;
    margin-right: 10px;
  }
}
</style>
