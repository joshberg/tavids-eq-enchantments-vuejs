<template>
  <h2>Target Info</h2>
  <form class="pure-form pure-form-aligned">
    <div class="pure-control-group">
      <label>Targeting Phrase</label>
      <input type="text" v-model="targetphrase" />
    </div>
    <div class="pure-control-group">
      <label>Use EM?</label>
      <input type="checkbox" v-model="useEm" />
    </div>
    <div class="pure-control-group" v-if="status.length > 0">
      <h4>{{ status }}</h4>
    </div>
  </form>
  <pre class="inset">{{ results }}</pre>
</template>

<script>
import escapeStringRegexp from "escape-string-regexp";
import db from "@/helpers/DB";
import web from "@/helpers/web";
import { logBufferStore } from "@/stores/logbuffer";
import { logFileStore } from "@/stores/logfile";

const timeStampRegex = /\[.*\]/g;

export default {
  setup() {
    const log = logFileStore();
    return {
      log,
    };
  },
  data() {
    return {
      name: "A Spectre",
      results: "",
      targetphrase: "inspects %t.",
      lastLine: "",
      useEm: true,
      status: "",
    };
  },
  methods: {
    getMobInfo() {
      db.mobs.find("name", this.name, (err, docs) => {
        if (err) {
          this.status = "Attempting to search for " + this.name;
          web
            .GetMobInfo(this.name)
            .then((result) => {
              this.status = "";
              console.log(result);
              this.results = JSON.stringify(result, "", 2);
            })
            .catch((err) => {
              this.status = "";
              console.log(err);
              this.results = "ERROR: " + JSON.stringify(err, "", 2);
            });
        }
        results = JSON.stringify(docs, "", 2);
      });
    },
  },
  computed: {
    logBufferStore: function () {
      return logBufferStore();
    },
  },
  watch: {
    logBufferStore: {
      handler(newValue) {
        const phraseParts = this.targetphrase.split("%t");
        const mobInfoRegEx = new RegExp(
          (this.useEm ? this.log.playerName + " " : "") +
            escapeStringRegexp(phraseParts[0]) +
            ".*" +
            escapeStringRegexp(phraseParts[1])
        );
        let targetLine = newValue.buffer.filter((x) => x.match(mobInfoRegEx));
        if (targetLine.length === 0) return;
        if (targetLine.length > 0)
          targetLine = targetLine[targetLine.length - 1].split(timeStampRegex)[1];
        if (this.lastLine === targetLine) return;

        this.lastLine = targetLine;
        this.name = this.lastLine
          .replace(this.log.playerName, "")
          .replace(phraseParts[0], "")
          .replace(phraseParts[1], "")
          .trim();

        this.getMobInfo();
      },
      deep: true,
    },
  },
};
</script>

<style>
.inset {
  border-style: inset;
  border-width: 1px;
}
</style>
