<template>
	<div>
		<Dropzone
	    :options="dropzoneOptions"
	    :id="_uid+'vwdropzone'"
	    ref="dropzone"
	    @vdropzone-success="fileUploaded"
	    @vdropzone-error="uploadError"
	    >
	  </Dropzone>
	  <small-alert ref="epTips"></small-alert>
	</div>
</template>
<script>
	import Dropzone from 'vue2-dropzone'
	import 'vue2-dropzone/dist/vue2Dropzone.css'
	import './dropzone.scss'
	import smallAlert from './small.alert'
	export default {
		props: ['options'],
		data () {
			return {
				
			}
		},
    components: {
      Dropzone,
      smallAlert
    },
    computed: {
      uploadURL () {
        return this.options.uploadURL;
      },
      dropzoneOptions () {
	      return {
	        ...this.options.dropzoneOptions,
	        id: `${this._uid}vwdropzone`,
	        url: this.uploadURL,
	        autoProcessQueue: this.uploadURL !== 'None',
	        dictDefaultMessage: `<i class="iconfont icon-upload" style="font-size: 30px;"></i><br>Click or Drop an image here`,
	      }
      }
    },
    methods: {
      fileUploaded (file, res) {
        if (res) {
          if (this.options.imgUrl) {
            let imgUrl = `${this.options.imgUrl}${res}`
            if (this.options.resName) {
              imgUrl = `${this.options.imgUrl}${res[this.options.resName]}`
            }
            this.$emit("uploadSuccess", imgUrl)
          } else {
            this.$emit("uploadSuccess", file.dataURL)
          }
        }
      },
      uploadError (file, message, xhr) {
      	this.$refs.epTips.showTips('上传失败！', 3000)
      	setTimeout(_ => {
      		this.$refs.dropzone.removeFile(file)
      	}, 1500)
      },
      getAcceptedFiles () {
      	const filesList = this.$refs.dropzone.getAcceptedFiles()
      	if (filesList && filesList.length) {
      		let res = []
      		filesList.forEach(item => {
      			let response = item && item.xhr && item.xhr.response && JSON.parse(item.xhr.response)
      			let imgUrl
      			if (this.options && this.options.imgUrl && response) {
      				imgUrl = `${this.options.imgUrl}${response}`
	            if (this.options.resName) {
	              imgUrl = `${this.options.imgUrl}${response[this.options.resName]}`
	            }
      			} else {
      				imgUrl = item.dataURL
      			}
      			res.push(imgUrl)
      		})
      		return res
      	} else {
      		return null
      	}
      }
    }
	}
</script>