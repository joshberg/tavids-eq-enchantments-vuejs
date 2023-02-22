<script lang="ts">
// Source: https://github.com/zafaralam/vue3-tabs/blob/main/src/components/Tab.vue
import { defineComponent } from "vue";
export default defineComponent({
  name: "Tab",
  props: ["title", "titleSlot", "disabled"],
});
</script>

<template>
  <div class="tab-panel" role="tabPanel">
    <div class="tab-content"><slot></slot></div>
  </div>
</template>

<style lang="scss">
.tab-panel {
  .tab-content {
    padding: 0.1rem;
  }
}
</style>
