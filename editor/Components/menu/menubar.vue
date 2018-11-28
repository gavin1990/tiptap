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
import { HEADING_LEVEL_COMMANDS, FORMAT_COMMANDS_LIST, TABLE_COMMANDS_LIST, BLOCK_COMMANDS_LIST, EDIT_COMMANDS_LIST } from './config'
export default {
  props: ['commands', 'isActive', 'editor'],
  data () {
    let FORMAT_LIST = [
      {
        name: 'Block',
        child: true,
        list: BLOCK_COMMANDS_LIST
      },
      {
        name: 'Heading',
        child: true,
        list: HEADING_LEVEL_COMMANDS()
      }
    ]
    FORMAT_LIST = FORMAT_COMMANDS_LIST.concat(FORMAT_LIST)
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
          list: EDIT_COMMANDS_LIST(this.commands)
        },
        {
          name: 'Format',
          type: 'format',
          list: FORMAT_LIST
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
          list: TABLE_COMMANDS_LIST
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
