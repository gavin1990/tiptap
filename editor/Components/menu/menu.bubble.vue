<template>
  <div class="menu_bubble">
    <template v-if="isActive.link()">
      <form class="menububble__form" v-if="linkMenuIsActive" @submit.prevent="commandHandle('link', {href: linkUrl})">
        <input class="menububble__input" type="text" v-model="linkUrl" placeholder="https://" ref="linkInput" @keydown.esc="hideLinkMenu" />
        <button class="menububble__button" @click="commandHandle('link', {href: null})" type="button">
          <icon name="remove" />
        </button>
      </form>

      <template v-else>
        <button class="menububble__button" @click="showLinkMenu(getMarkAttrs('link'))">
          <span>Edit Link</span>
          <icon name="link" />
        </button>
      </template>
    </template>
  </div>
</template>
<script>
import Icon from 'Components/Icon'
export default {
  props: ['commands', 'isActive', 'editor', 'getMarkAttrs'],
  data () {
    return {
      menuIsActive: false,
      linkMenuIsActive: false,
      linkUrl: ''
    }
  },
  components: {
    Icon
  },
  methods: {
    commandHandle (type, attrs) {
      this.commands[type](attrs)
      this.editor.focus()
    },
    showLinkMenu (attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu () {
      this.linkUrl = null
      this.linkMenuIsActive = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu_bubble{
    line-height: 20px;
    .menububble__form{
      font-size: 14px;
    }
  }
</style>