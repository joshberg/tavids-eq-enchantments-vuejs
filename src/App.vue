<template>
  <div class="pure-g mx1">
    <div class="pure-u-3-8 pure-u-md-1-3 pure-u-sm-1-1">
      <app-configuration />
    </div>
    <div class="pure-u-5-8 pure-u-md-2-3 pure-u-sm-1-1">
      <div class="pure-u-3-4">
        <buffer-window />
      </div>
      <div class="pure-u-1-4">
        <div class="pure-u-1-16 pure-u-md-1-3 pure-u-sm-1-1">
          <button @click="launchDps">Launch DPS</button><br />
          <button @click="launchTell">Launch Tell</button><br />
          <button @click="launchTarget">Launch Target</button>
        </div>
      </div>
    </div>
    <div class="pure-u-1-4 pure-u-md-1-3 pure-u-sm-1-1">
      <dps-window />
    </div>
    <div class="pure-u-1-2 pure-u-md-1-3 pure-u-sm-1-1">
      <tell-window />
    </div>
    <div class="pure-u-1-4 pure-u-md-1-3 pure-u-sm-1-1">
      <mob-window />
    </div>
  </div>
</template>

<script>
import AppConfiguration from "@/components/AppConfiguration.vue";
import BufferWindow from "@/components/BufferWindow.vue";
import DpsWindow from "@/components/DpsWindow.vue";
import TellWindow from "@/components/TellWindow.vue";
import MobWindow from "@/components/MobWindow.vue";

export default {
  name: "App",
  components: {
    AppConfiguration,
    BufferWindow,
    DpsWindow,
    TellWindow,
    MobWindow,
  },
  methods: {
    spawnWindow(type) {
      var gui = this.require("nw.gui");
      gui.Window.open(`${type}.html`, {
        position: "center",
        width: 300,
        height: 400,
        always_on_top: true,
        new_instance: true,
        mixed_context: true,
        id: type,
      });
    },
    launchDps() {
      this.spawnWindow("dps");
    },
    launchTarget() {
      this.spawnWindow("target");
    },
    launchTell() {
      this.spawnWindow("tell");
    },
  },
};
</script>

<style>
body {
  background-color: #333;
  color: lightgray;
}
</style>
