<template>
  <div>
    <div class="editor">
      <editor-menu-bar :editor="editor">
        <div class="menubar" slot-scope="{ commands, isActive }">
          <menu-bar :commands="commands" :is-active="isActive" :editor="editor"></menu-bar>
          <tool-bar :commands="commands" :is-active="isActive" :editor="editor"></tool-bar>
        </div>
      </editor-menu-bar>

      <editor-content class="editor__content" :editor="editor" style="width: 800px;margin: 0 auto;" />
    </div>
    <div class="actions">
      <button class="button" @click="clearContent">
        Clear Content
      </button>
      <button class="button" @click="setContent">
        Set Content
      </button>
    </div>

    <div class="export">
      <h3>JSON</h3>
      <pre><code v-html="json"></code></pre>

      <h3>HTML</h3>
      <pre><code>{{ html }}</code></pre>
    </div>
  </div>
</template>

<script>
import Icon from 'Components/Icon'
import menuBar from 'Components/menu/menubar'
import toolBar from 'Components/menu/toolbar'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History,
  TextAlign,
  TextIndent,
  LineSpacing,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
    menuBar,
    toolBar
  },
  data() {
    return {
      editor: new Editor({
        image: {
          uploadURL: 'http://api.testmem.everjiankang.com.cn/passport/doctor/img/uploadImg',
          imgUrl: 'http://img.testmem.everjiankang.com.cn/',
          resName: 'data',
          dropzoneOptions: {
            addRemoveLinks: true,
            maxFilesize: 0.5,
            acceptedFiles: 'image/*',
            headers: {
              'x-access-token': 'RKs2+UcefbToIKbdmEVAuRotFaF6tdSSPeXdI8w2JFCsqA+kKNvXR1Um1v5eeLjNp0VIyJN2qRd2CbEnHjm2J6xgyXjiju15OZsp3ZgP9U/XPWlACSf2C7l6OdYFxJcxUsXSDLOvWSed1vASHGoasgGb0ek/PyTpYPip0KuktMM%3D%2CTM/La/ZWxiQKA83pmr7pst67xsoIQk7V48lasq3U2p6RgYV0E4GvcB3BYAki1t/28ddoBVjx+DSeX91HnoJSkGOpXnVO2lxBb0pDD+/3LI5cX90DYTjjBoEj2iTpIkcoriUZVtKnMFLrqTkdaqvtpSWIFuccIe0aiDXfPHiCg2c%3D%2CCEG52cbuIw76FY050aI3RcB3ByCvwMWtlrZ8vDrDJJcFIQDH5C38AEjLofxguKtR/PWBZwf43yNiwQu5ZkwlphSXTQlBQjt2u/4gkRN+KgO5iPDenRJ90XCJ4kox3Az3FNtlLxz0BEHhL6LrGztObHZMWdSDGChliGVHZ/pdDgg%3D'
            }
          }
        },
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new TextAlign(),
          new TextIndent(),
          new LineSpacing(),
          new Image(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
        ],
        content: `
          <h2>
            Example content
          </h2>
          <p>The table:</p>
          <table>
            <tr>
              <th colspan=3 data-colwidth="100,0,0">Wide header</th>
            </tr>
            <tr>
              <td>One</td>
              <td>Two</td>
              <td>Three</td>
            </tr>
            <tr>
              <td>Four</td>
              <td>Five</td>
              <td>Six</td>
            </tr>
          </table>
        `,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON()
          this.html = getHTML()
        },
      }),
      json: 'Update content to see changes',
      html: 'Update content to see changes',
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    clearContent() {
      this.editor.clearContent(true)
      this.editor.focus()
    },
    setContent() {
      // you can pass a json document
      this.editor.setContent({
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is some inserted text. 👋',
            },
          ],
        }],
      }, true)

      // HTML string is also supported
      // this.editor.setContent('<p>This is some inserted text. 👋</p>')

      this.editor.focus()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.actions {
  max-width: 30rem;
  margin: 0 auto 2rem auto;
}

.export {

  max-width: 30rem;
  margin: 0 auto 2rem auto;

  pre {
    padding: 1rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: bold;
    background: rgba($color-black, 0.05);
    color: rgba($color-black, 0.8);
  }

  code {
    display: block;
    white-space: pre-wrap;
  }
}
</style>
