<template>
  <sketch-picker v-model="colors"></sketch-picker>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
  props: ['item', 'color'],
  data () {
    return {
      colors: this.color || '#333333'
    }
  },
  components: {
    'sketch-picker': Sketch,
  },
  watch: {
    colors (val) {
      this.$emit('picker', val, this.item)
    },
    color (val) {
      if (val) this.colors = val
    }
  }
}
</script>