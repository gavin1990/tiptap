<template>
  <div class="like_sel" v-if="itemShow">
    <span class="sel_box inp_box" :class="{select: !!options.select}" @click="activeClass">
      <template v-if="options.select">
        {{selectAttrs}}{{options.selectExtend}}
      </template>
      <template v-else-if="options.name">
        <template v-if="bar === 'tool' && options.icon">
          <slot name="name"></slot>
        </template>
        <template v-else>{{options.name}}</template>
      </template>
      <template v-else>
        <slot name="name"></slot>
      </template>
      <i class="iconfont icon-arrow-down font_midd" v-if="!arrowDownIconHide || options.select"></i>
    </span>
    <transition name="slide" mode="out-in">
      <div class="sel_option" :class="{arrow: arrow}" v-if="active">
        <ul class="ul_list">
          <li class="col" v-for="(item,index) in options.list" v-if="(item.commandCode === 'table' && isActive[item.commandCode] && isActive[item.commandCode]()) || item.commandCode !== 'table' || item.commandType === 'insertTable'" :class="{child: item.child, 'is-active': (item.commandCode && item.commandCode !== 'table' && isActive[item.commandCode] && isActive[item.commandCode](item.attrs)) || (item.active && selectAttrs && item.active === selectAttrs)}" :key="index">
            <template v-if="item.commandCode === 'table' && item.commandType && item.type !== 'color'">
              <label @click="commandHandle(item)">
                <em class="font_midd">
                  <i v-if="item.icon" :class="'iconfont ' + item.icon"></i>
                </em>
                <span>{{item.name}}</span>
                <i v-if="item.child" class="child_icon iconfont icon-arrow-right"></i>
              </label>
            </template>
            <template v-else>
              <label @click="commandHandle(item)">
                <em class="font_midd">
                  <i v-if="item.icon" :class="'iconfont ' + item.icon"></i>
                </em>
                <span>{{item.name}}</span>
                <i v-if="item.child" class="child_icon iconfont icon-arrow-right"></i>
              </label>
            </template>
            <!-- insert table -->
            <div v-if="item.commandType === 'insertTable'" class="menu_item table_insert">
              <table @mouseleave="initTableSel" @click="commandHandle(item)">
                <tr v-for="row in 10" :key="row">
                  <td v-for="col in 10" :key="col" ref="tableTd" @mouseover="selectTable(row, col)">
                    <a :class="{'sel_active': (row <= tableRows && col <= tableCols)}"></a>
                  </td>
                </tr>
              </table>
              <p class="alg_c">{{tableCols}} x {{tableRows}}</p>
            </div>
            <template v-if="item.child && item.list && item.list.length">
              <div class="menu_item">
                <ul class="ul_list">
                  <template v-for="(sitem, sindex) in item.list">
                    <!-- table handle -->
                    <template v-if="sitem.commandCode === 'table' && sitem.commandType">
                      <li class="col" @click="commandHandle(sitem)" :key="sindex">{{sitem.name}}</li>
                    </template>
                    <template v-else>
                      <li class="col" :class="{'is-active': sitem.commandCode && isActive[sitem.commandCode] && isActive[sitem.commandCode](sitem.attrs)}" @click="commandHandle(sitem)" :key="sindex">{{sitem.name}}</li>
                    </template>
                  </template>
                </ul>
              </div>
            </template>
            <template v-if="item.type === 'color'">
              <div class="menu_item">
                <color-picker :item="item" @picker="setColor"></color-picker>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { findSelectedNodeOfType } from 'prosemirror-utils'
import { domClickHandle } from '../utils'
import colorPicker from './color.picker'
export default {
  props: ['options', 'markAttrs', 'arrowDownIconHide', 'arrow', 'current', 'commands', 'isActive', 'editor', 'bar'],
  data () {
    return {
      active: false,
      tableRows: 1,
      tableCols: 1,
      selectionAttrs: '',
      selectMarkAttrs: this.markAttrs
    }
  },
  components: {
    colorPicker
  },
  computed: {
    itemShow () {
      if (['table'].includes(this.options.type)) {
        return this.isActive[this.options.type] && this.isActive[this.options.type]()
      }
      return true
    },
    selectAttrs () {
      if (this.options.type === 'heading') {
        let select = this.options.list[0].name
        this.options.list.forEach(item => {
          if (this.isActive[item.commandCode](item.attrs)) {
            select = item.name
          }
        })
        return select
      } else {
        if (this.selectMarkAttrs[this.options.selectAttrs]) return this.selectMarkAttrs[this.options.selectAttrs]
        if (this.options.list[0].attrs[this.options.selectAttrs]) return this.options.list[0].attrs[this.options.selectAttrs]
      }
      return ''
    }
  },
  created () {
    domClickHandle('like_sel', _ => {
      this.active = false
    })
  },
  methods: {
    commandHandle (item) {
      if (item.type === 'color') return false
      if (item.command) return item.command(item.attrs)
      if (item.commandCode) {
        if (item.commandAfterClose) this.active = false
        if (item.commandCode === 'image') {
          const selectedNode = this.getSelectionAttrs(item.commandCode)
          this.$emit('command', 'image', selectedNode)
        } else if (item.commandCode === 'table') {
          if (!item.commandType) return false
          let attrs = { type: item.commandType }
          attrs = item.attrs ? Object.assign(attrs, item.attrs) : attrs
          if (item.commandType === 'insertTable') {
            attrs = { type: 'insert', options: { rows: this.tableRows, cols: this.tableCols, headerRow: false } }
            this.commands.table(attrs)
            this.initTableSel()
          } else {
            this.commands.table(attrs)
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
    activeClass () {
      this.active = !this.active
      if (this.active) {
        this.$emit('active', this.options.type)
      }
    },
    selectTable (row, col) {
      this.tableRows = row
      this.tableCols = col
    },
    initTableSel () {
      this.tableRows = 1
      this.tableCols = 1
    },
    setColor (color, item) {
      item.attrs = item.attrs || {}
      if (item.commandType) {
        item.attrs.type = item.commandType
        item.attrs.options = item.attrs.options || {}
        item.attrs.options[item.attrsName] = color.hex8
      } else {
        item.attrs[item.attrsName] = color.hex8
      }
      if (item.command) return item.command(item.attrs)
      if (item.commandCode) {
        return this.commands[item.commandCode](item.attrs)
      }
    }
  },
  watch: {
    current (val) {
      if (val !== this.options.type) this.active = false
    },
    markAttrs: {
      deep: true,
      handler (val) {
        this.selectMarkAttrs = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.like_sel {
  .alg_c {
    text-align: center;
  }
  em {
    font-style: normal;
  }
  display: inline-block;
  position: relative;
  .title {
    padding: 0 0 0 5px;
  }
  .font_midd {
    display: inline-block;
    vertical-align: middle;
  }
  .sel_box {
    display: inline-block;
    position: relative;
    font-size: 14px;
    text-align: center;
    min-width: 30px;
    cursor: pointer;
    &.select {
      padding: 0 5px;
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
  .sel_option {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 200;
    .ul_list {
      list-style: none;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      background: #fff;
      font-size: 14px;
      .col {
        min-width: 140px;
        padding: 0 10px;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
        label {
          display: block;
          font-size: 14px;
          em {
            width: 20px;
          }
          cursor: pointer;
        }
        .iconfont {
          margin-right: 5px;
          font-size: 14px;
          color: #555;
        }
        &:hover {
          background: #f5f5f5;
          .menu_item {
            display: block;
          }
        }
        &.is-active {
          background: #f5f5f5;
        }
        &.child {
          label {
            position: relative;
          }
          .child_icon {
            position: absolute;
            right: 0;
            top: 0px;
            margin: 0;
            font-size: 16px;
          }
        }
        .menu_item {
          display: none;
          position: absolute;
          left: 100%;
          top: 0;
          min-width: 130px;
          padding: 5px;
          border: 1px solid #dcdcdc;
          background: #fff;
          .vc-sketch {
            box-shadow: none;
            border-radius: 0;
          }
          /deep/ .vc-sketch-presets {
            white-space: normal;
          }
        }
        .ul_list {
          padding: 0;
          border: none;
        }
      }
    }
    &.arrow {
      top: 110%;
      &:before {
        position: absolute;
        display: inline-block;
        top: -6px;
        left: 10px;
        width: 0;
        height: 0px;
        content: '';
        border-style: solid;
        border-width: 6px;
        border-color: #fff #fff #ddd #ddd;
        transform: rotate(135deg);
      }
      &:after {
        position: absolute;
        display: inline-block;
        top: -5px;
        left: 10px;
        width: 0;
        height: 0px;
        content: '';
        border-style: solid;
        border-width: 6px;
        border-color: #fff #fff;
        transform: rotate(135deg);
      }
    }
  }
  .table_insert {
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0;
    overflow: hidden;
    td {
      border: 1px solid #ddd;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      a {
        display: block;
        width: 14px;
        height: 14px;
        cursor: pointer;
        &.sel_active {
          background: #9df1ef;
        }
      }
    }
    p {
      margin: 5px 0;
      line-height: 16px;
    }
  }
}
</style>