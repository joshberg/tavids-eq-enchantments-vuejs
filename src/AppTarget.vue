<template>
  <div class="pure-g mx1">
    <div class="pure-u-1-1">
      <mob-window />
    </div>
  </div>
</template>

<script>
import MobWindow from "@/components/MobWindow.vue";

export default {
  name: "App",
  components: {
    MobWindow,
  },
};
</script>

<style scoped>
body {
  background: rgba(20, 20, 20, 0.5);
  color: rgb(200, 200, 200);
}
</style>
