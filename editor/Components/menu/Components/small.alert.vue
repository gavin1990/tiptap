<!--
   <ep-alert ref="epTips"></ap-alert>

   this.$refs.epTips.showTips('提交成功');
   this.$refs.epTips.showTips('提交成功', 5000);
-->
<template>
     <div :class="'alert_tips '+ active" v-if="tipsShow"><span :class="'time_01 fadeDown '+ error">{{alertTips}}</span></div>
</template>
<script>
    export default {
    	data(){
            return{
                tipsShow: false,
                active: '',
                tipsIng: false,
                timmer: null,
                alertTips: ''
            }
        },
        props: ['error'],
        methods:{
            showTips(txt, time){
                const _that = this;
                this.alertTips = txt || ''
                if(!_that.tipsIng){
                    _that.showFn(time);
                }else{
                    clearTimeout(_that.timmer);
                    _that.showFn(time);
                }
            },
            showFn(time){
                const _that = this;
                _that.tipsIng = true;
                _that.tipsShow = true;
                setTimeout(()=>{
                    _that.active = 'active';
                },200);
                _that.timmer = setTimeout(()=>{
                    _that.closeTips();
                    _that.tipsIng = false;
                },time || 3000)
            },
            closeTips(){
                const _that = this;
                _that.active = '';
                setTimeout(()=>{
                    _that.tipsShow = false;
                },200)
            }
        }
    }
</script>

<style lang="scss" scoped>
  .alert_tips{position:fixed;top:0;left:50%;width:94%;margin-left:-47%;text-align:center;z-index:202;
    span{
      display:inline-block;width: 300px;padding:10px 20px;line-height:20px;font-size:14px;color:#fff;text-align:center;background-color:rgba(0,0,0,.6);
    }
    span.error{
      background-color:rgba(240,65,48,.9);
    }
  }
</style>
