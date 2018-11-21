<template>
  <div :class="'m_dialog ' + dialogClass" v-if="dialogVisible" @click="layoutClose">
    <div class="inner">
      <div class="dialog_wrap">
        <transition name="slide" mode="out-in">
          <div class="dia_con_box" v-if="active">
            <div class="ic_close close_btn" v-if="!closeBtn" @click="close"><i class="iconfont icon-close"></i></div>
            <div class="handler_box">
              <h2 class="dia_til" v-if="title">{{title}}</h2>
              <div class="handle_con">
                <slot name="content"></slot>
              </div>
            </div>
            <div class="dialog_bom ui_01" v-if="confirm">
              <span class="btn sub_btn" @click="submit">确定</span><span class="btn" @click="cancel">取消</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        dialogVisible: false,
        active: false,
        dialogClass: this.className || '',
        dialogData: null
      }
    },
    props: ['content', 'closeBtn', 'layoutTrigger', 'className', 'title', 'confirm'],
    created () {
      if (this.confirm) this.dialogClass = 'confirm'
    },
    methods: {
      open (data) {
        if (data) this.dialogData = data
        this.dialogVisible = true
      },
      close () {
        this.active = false
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.dialogVisible = false
          }, 300)
        })
      },
      layoutClose(e){
        let _self = this
        if (e.target.className.indexOf('dialog_wrap') != -1 && !_self.layoutTrigger) {
            _self.close()
        }
      },
      submit () {
        this.$emit('submit', this.dialogData)
        this.close()
      },
      cancel () {
        this.close()
        this.$emit('cancel', this.dialogData)
      }
    },
    watch: {
      dialogVisible (val) {
        this.$nextTick(_ => {
          setTimeout(_ => {
            this.active = val
          }, 50)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .m_dialog{
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255, 255, 255, 0.6);z-index:9000;
    .inner{display:table;width:100%;height:100%;overflow:hidden}
    .dialog_wrap{display:table-cell;vertical-align:middle}
    .dia_con_box{position:relative;width:60%;margin:0 auto;box-shadow: 0px 1px 9px rgba(0,0,0,.1);border: 1px solid #eee;background: #fff;}
    .ic_close{position:absolute;top:10px;right:10px;width:20px;height:20px;line-height: 16px;text-align: center;background:#fff;cursor: pointer;
      i{font-size: 12px;color: #979797}
    }
    .handler_box{
      color: #666;
      .dia_til{font-size:14px;padding:10px;margin:0;font-weight: normal;text-align:left;border-bottom: 1px solid #e4e7ed;}
    }
    .tips_txt{font-size:14px;color:#333;text-align:center}
    .dialog_bom{
      margin-top: 30px;
      border-top: 1px solid #e4e7ed;
      padding: 10px;
      text-align: right;
      .btn{
        display: inline-block;
        font-size:12px;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        color: #666;
        background: #e6e6e6;
        margin-left: 10px;
        border-radius: 2px;
        cursor: pointer;
      }
      .btn.sub_btn{
        color: #fff;
        background: #fd684a;
      }
    }
  }
  .m_dialog.normal{
    .dia_con_box{
      width: 500px;
      .handle_con{
        padding: 10px;
      }
    }
  }
  .m_dialog.confirm{
    .dia_con_box{
      width: 500px;
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
    transition: all 0.2s ease-in;
  }
  .slide-leave-active {
    transition: all 0.2s ease-in-out;
  }
</style>
