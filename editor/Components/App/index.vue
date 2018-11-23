<template>
  <div class="page" spellcheck="false">
    <subnavigation />

    <div class="page__content">
      <router-view />
    </div>

  </div>
</template>

<script>
import Navigation from 'Components/Navigation'
import Hero from 'Components/Hero'
import Subnavigation from 'Components/Subnavigation'
import Icon from 'Components/Icon'
import Ad from 'Components/Ad'

export default {
  components: {
    Navigation,
    Hero,
    Subnavigation,
    Icon,
    Ad,
  },
}
</script>

<style lang="scss" src="./style.scss"></style>
<style src="../../assets/iconfont/iconfont.css"></style>
