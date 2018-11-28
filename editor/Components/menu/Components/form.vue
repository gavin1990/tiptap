<template>
	<form @submit.prevent="submitHandle">
		<ul class="form_wrap">
			<li class="col" v-for="(item, index) in schema" :key="index">
				<label class="label">{{item.label}}</label>
				<template v-if="item.comp === 'image-props'">
					<div class="inp_wrap">
						<div class="inp_box"><input type="number" name="width" min="1" autocomplete="off" v-model="value.width" placeholder="width"></div>
						<span class="split">x</span>
						<div class="inp_box"><input type="number" name="height" min="1" autocomplete="off" v-model="value.height" placeholder="height"></div>
					</div>
				</template>
				<template v-else-if="item.comp === 'custom'">
					<slot :name="item.name"></slot>
				</template>
				<div class="inp_box" v-else><input type="text" v-model="value[item.name]" :placeholder="(item.props && item.props.placeholder) || item.label"></div>
			</li>
		</ul>
	</form>
</template>

<script>
  export default {
    props: ['schema', 'value'],
    data () {
      return {

      }
		},
		methods: {
			submitHandle () {
				this.$emit('submit')
			}
		},
    watch: {
      value: {
        deep: true,
        handler (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .form_wrap{
		font-size: 14px;
    padding: 10px;
		.col{
			display: flex;
			align-items: center;
			.label{
				width: 85px;
			}
			.inp_wrap{
				flex: 1;
				display: flex;
				align-items: center;
				.split{
					padding: 0 5px;
				}
			}
			.inp_box{
				padding: 5px;
				flex: 1;
				border-bottom: 1px solid #eee;
				input{
					width: 100%;
					border: none;
				}
			}
			.check_box{
				padding: 5px;
				flex: 2;
				display: flex;
				align-items: center;
				.checked_icon{
					position: relative;
					width: 14px;
					height: 14px;
					border: 1px solid #eee;
					margin-right: 5px;
					.icon-select{
						position: absolute;
						top: 0;
						left: 0;
						font-size: 12px;
						line-height: 14px;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
