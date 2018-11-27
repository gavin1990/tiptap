<template>
  <sketch-picker v-model="colors"></sketch-picker>
</template>
<script>
import { Sketch } from 'vue-color'
import Color from 'color'
export default {
  props: ['item', 'color'],
  data () {
    return {
      colors: '#333333'
    }
  },
  created () {
    if (this.color) {
      let s_color = {}
      s_color.a = Color(this.color).alpha()
      s_color.hex = Color(this.color).hex()
      s_color.rgba = Color(this.color).object()
      if (s_color.rgba.alpha) {
        s_color.rgba.a = s_color.rgba.alpha
        delete s_color.rgba.alpha
      }
      this.colors = s_color
    }
  },
  components: {
    'sketch-picker': Sketch,
  },
  watch: {
    colors (val) {
      if (val && val.hex8) {
        this.$emit('picker', val, this.item)
      }
    }
  }
}
</script>