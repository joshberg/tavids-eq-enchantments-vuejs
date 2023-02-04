<template>
  <h2>Buffer</h2>
  <div class="container">
    <div id="buffer-window" class="buffer">
      <pre>{{ blob }}</pre>
      <pre><span v-for="(x, index) in logBuffer.buffer" :key="index">{{ x }}<br/></span></pre>
    </div>
  </div>
</template>

<script>
import { logFileStore } from "@/stores/logfile";
import { logBufferStore } from "@/stores/logbuffer";

export default {
  setup() {
    const logBuffer = logBufferStore();

    return {
      logBuffer,
    };
  },
  data() {
    return {
      blob: "",
    };
  },
  methods: {
    restartFileListener() {
      console.log("Restart file listener for : " + logFileStore().path);
    },
  },
  computed: {
    logFileStore: function () {
      return logFileStore();
    },
  },
  watch: {
    logFileStore: {
      handler(newValue) {
        const lclPath = newValue.path;

        const fs = this.require("fs");
        if (!fs.existsSync(lclPath)) return;
        const Tail = this.require("always-tail");

        this.blob = fs.readFileSync(lclPath);

        const tail = new Tail(lclPath, "\n", { interval: 500 });
        tail.on("line", (data) => {
          this.logBuffer.append(data);
          let div = document.getElementById("buffer-window");
          div.scrollTop = div.scrollHeight;
        });
        tail.on("error", (err) => {
          console.log(err);
        });
        tail.watch();
      },
      deep: true,
    },
  },
};
</script>

<style>
.container {
  display: flex;
}
.buffer {
  margin-left: 0.5em;
  margin-right: 0.5em;
  flex-grow: 1;
  padding: 1em;
  max-height: 20vh;
  border-style: inset;
  border-width: 1px;
  overflow-y: scroll;
}
</style>
