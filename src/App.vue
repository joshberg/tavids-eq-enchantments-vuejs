<template>
  <div class="pure-g">
    <div class="pure-u-3-8 pure-u-md-1-3 pure-u-sm-1-1">
      <app-configuration />
    </div>
    <div class="pure-u-5-8 pure-u-md-2-3 pure-u-sm-1-1">
      <buffer-window />
    </div>
    <div class="pure-u-1-4 pure-u-md-1-3 pure-u-sm-1-1">
      <dps-window />
    </div>
    <div class="pure-u-1-2 pure-u-md-1-3 pure-u-sm-1-1">
      <tell-window />
    </div>
  </div>
</template>

<script>
import AppConfiguration from "@/components/AppConfiguration.vue";
import BufferWindow from "@/components/BufferWindow.vue";
import DpsWindow from "@/components/DpsWindow.vue";
import TellWindow from "@/components/TellWindow.vue";

export default {
  name: "App",
  components: {
    AppConfiguration,
    BufferWindow,
    DpsWindow,
    TellWindow,
  },
};
</script>

<style scoped></style>
