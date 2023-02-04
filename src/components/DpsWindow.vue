<template>
  <h2>DPS Info</h2>
  <div class="pure-g">
    <div class="pure-u-1-2">Current:</div>
    <div class="pure-u-1-2">
      {{ current }}
    </div>
    <div class="pure-u-1-2">Recent Max:</div>
    <div class="pure-u-1-2">
      {{ recentMax }}
    </div>
    <div class="pure-u-1-2">Avg Dmg:</div>
    <div class="pure-u-1-2">
      {{ avgDmg }}
    </div>
    <div class="pure-u-1-1">
      Size: {{ sampleSize }} &nbsp;&nbsp;&nbsp; Time(seconds): {{ sampleTimeFrame }}
    </div>
  </div>
</template>

<script>
import { logBufferStore } from "@/stores/logbuffer";
import { logFileStore } from "@/stores/logfile";

const dpsRegex = /You{1}\s(slash|bash|punch|kick|crush|pierce|strike)/g;
const timeStampRegex = /\[.*\]/g;

const getDate = (msg) => {
  let lcl = msg.match(timeStampRegex)[0];
  lcl = lcl.replace("[", "").replace("]", "");
  return Date.parse(lcl);
};

export default {
  setup() {
    const log = logFileStore();
    return {
      log,
    };
  },
  data() {
    return {
      current: 0,
      recentMax: 0,
      avgDmg: 0,
      sampleSize: 0,
      sampleTimeFrame: "",
    };
  },
  computed: {
    logBufferStore: function () {
      return logBufferStore();
    },
  },
  watch: {
    logBufferStore: {
      handler(newValue) {
        const dpsMsgs = newValue.buffer.filter(
          (x) =>
            x.match(dpsRegex) ||
            x.match(
              new RegExp("/" + this.log.playerName + ".+(critical|crippling).+(d+)/g")
            )
        );

        if (dpsMsgs.length == 0) return;

        const dps = dpsMsgs.map((x) => {
          return {
            time: getDate(x),
            dmg: parseInt(x.replace(timeStampRegex, "").match(/\d+/g)[0]),
          };
        });

        const recent = dps.filter((x) => x.time > Date.now() - 30000);

        if (recent.length == 0) return;

        this.sampleSize = recent.length;
        this.sampleTimeFrame = (recent.slice(-1)[0].time - recent[0].time) / 1000;
        const dmgTotal = recent.map((x) => x.dmg).reduce((a, b) => a + b, 0);

        this.current = (dmgTotal / this.sampleTimeFrame).toFixed(2);
        this.recentMax = Math.max(...recent.map((x) => x.dmg));
        this.avgDmg = (dmgTotal / this.sampleSize).toFixed(2);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
