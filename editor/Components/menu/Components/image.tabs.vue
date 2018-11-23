<template>
	<div class="e_taps">
		<div class="e_taps_nav_wrap">
			<ul class="e_taps_nav">
				<li class="item" @click="activeName = 'General'" :class="{active: activeName === 'General'}">General</li>
				<li class="item" @click="activeName = 'Upload'" :class="{active: activeName === 'Upload'}">Upload</li>
			</ul>
		</div>
		<div class="e_taps_con">
			<div class="e_taps_con_inner">
				<div class="item" :class="{hide: activeName !== 'General'}">
					<ul class="form_wrap">
						<li class="col">
							<label class="label">Source</label>
							<div class="inp_box"><input type="text" name="Source" v-model="image.src" placeholder="Source" @blur="computeImage"></div>
						</li>
						<li class="col">
							<label class="label">Title</label>
							<div class="inp_box"><input type="text" name="Title" v-model="image.title" placeholder="Title"></div>
						</li>
						<li class="col">
							<label class="label">Description</label>
							<div class="inp_box"><input type="text" name="Description" v-model="image.alt" placeholder="Description"></div>
						</li>
						<li class="col">
							<label class="label">Dimensions</label>
							<div class="inp_wrap">
								<div class="inp_box"><input type="number" name="width" min="1" autocomplete="off" v-model="image.width" placeholder="width" @blur="computeHeight"></div>
								<span class="split">x</span>
								<div class="inp_box"><input type="number" name="height" min="1" autocomplete="off" v-model="image.height" placeholder="height" @blur="computeWidth"></div>
								<div class="check_box" @click="isConstrainProportions = !isConstrainProportions">
									<div class="checked_icon" :class="{active: isConstrainProportions}"><i v-if="isConstrainProportions" class="iconfont icon-select"></i></div><div>Constrain proportions</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="item"  :class="{hide: activeName !== 'Upload'}">
					<image-upload ref="imageUpload" :options="editor && editor.options && editor.options.image"></image-upload>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {getImageSize} from '../utils'
	import imageUpload from './upload'
	export default {
		props: ['attrs', 'editor'],
		data () {
			return {
				activeName: 'General',
				isConstrainProportions: true,
				image: {
					src: '',
					title: '',
					alt: '',
					width: '',
					height: '',
					type: 'General'
				},
				imageRatio: 1
			}
		},
		components: {
			imageUpload
		},
		created () {
			if (this.attrs && this.attrs.src) Object.assign(this.image, this.attrs)
			if (!this.image.width && !this.image.height) this.computeImage()
		},
		methods: {
			computeWidth () {
				if (this.image.height && this.isConstrainProportions) this.image.width = Math.ceil(this.image.height * this.imageRatio)
			},
			computeHeight () {
				if (this.image.width && this.isConstrainProportions) this.image.height = Math.ceil(this.image.width / this.imageRatio)
			},
			computeImage () {
				getImageSize(this.image.src, data => {
					if (data) {
						if (data.width) this.image.width = data.width
						if (data.height) this.image.height = data.height
						if (data.width && data.height) {
							this.imageRatio = data.width / data.height
						}
					}
				})
			},
			getUploadFiles () {
				return this.$refs.imageUpload.getAcceptedFiles()
			}
		},
		watch: {
			image: {
				handler () {
					this.$emit('image', this.image)
				},
				deep: true
			},
			activeName (val) {
				this.image.type = val
			}
		}
	}
</script>
<style lang="scss" scoped>
	ul{list-style: none;}
	.e_taps{
		.e_taps_nav_wrap{
			.e_taps_nav{margin-bottom: -1px;overflow: hidden;}
			.item{
				position: relative;
				float: left;
				padding: 5px 10px;
				border-right: 1px solid #e4e7ed;
				font-size: 14px;
				cursor:pointer;
				&.active{
					&:after{
						content:'';
						position:absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 0;
						border-bottom: 1px solid #fff;
					}
				}
			}
			border-bottom: 1px solid #e4e7ed;
		}
		.e_taps_con{
			padding: 10px;
			.e_taps_con_inner{
				min-height: 100px;
				.item{
					width: 100%;
				}
				.hide{
					display: none;
				}
			}
		}
	}
	.form_wrap{
		font-size: 14px;
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