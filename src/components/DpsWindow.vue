<template>
  <h2>Melee DPS</h2>
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
      Size: {{ sampleSize }} &nbsp;&nbsp;&nbsp; Time(seconds):
      {{ sampleTimeFrame }}
    </div>
    <div class="pure-u-1-1">
      <form class="pure-form pure-form-aligned">
        <div class="pure-control-group">
          <select id="dps-player" v-model="selectedName">
            <option v-for="name in names" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
      </form>
    </div>
    <div v-if="selectedName?.length > 0 && selectedName !== 'You'">
      <div class="pure-u-1-2">Current:</div>
      <div class="pure-u-1-2">
        {{ dpsNameMap[selectedName]?.current }}
      </div>
      <div class="pure-u-1-2">Recent Max:</div>
      <div class="pure-u-1-2">
        {{ dpsNameMap[selectedName]?.recentMax }}
      </div>
      <div class="pure-u-1-2">Avg Dmg:</div>
      <div class="pure-u-1-2">
        {{ dpsNameMap[selectedName]?.avgDmg }}
      </div>
      <div class="pure-u-1-1">
        Size: {{ dpsNameMap[selectedName]?.sampleSize }} &nbsp;&nbsp;&nbsp; Time(seconds):
        {{ dpsNameMap[selectedName]?.sampleTimeFrame }}
      </div>
    </div>
  </div>
</template>

<script>
import { logBufferStore } from "@/stores/logbuffer";
import { logFileStore } from "@/stores/logfile";

const timeStampRegex = /\[.*\]/g;
const combatTerms = [
  "slash",
  "slashes",
  "bash",
  "bashes",
  "punch",
  "punches",
  "kick",
  "kicks",
  "crush",
  "crushes",
  "pierce",
  "pierces",
  "strike",
  "strikes",
  "claw",
  "claws",
  "bite",
  "bites",
];

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
      names: [],
      selectedName: "You",
      dpsNameMap: {},
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
        const combatMsgs = newValue.buffer.filter((x) =>
          x.match(new RegExp(`(${combatTerms.join("|")})`, "g"))
        );

        const names = combatMsgs.map(
          (x) =>
            x
              .split(timeStampRegex)[1]
              .split(new RegExp(` (${combatTerms.join("|")})`, "g"))[0]
        );

        // Get dps for the player:
        const dpsRegex = new RegExp(`You (${combatTerms.join("|")})`, "g");

        const critRegex = new RegExp(
          this.log.playerName + ".+(critical|crippling).+(d+)",
          "g"
        );

        const dpsMsgs = combatMsgs.filter((x) => x.match(dpsRegex) || x.match(critRegex));

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
        // End get dps for player

        this.names = ["You"];
        names.forEach((name) => {
          if (!this.names.includes(name)) this.names.push(name);
        });

        this.names.forEach((name) => {
          // Get dps for name
          const lcldpsRegex = new RegExp(name + ` (${combatTerms.join("|")})`, "g");

          const lclcritRegex = new RegExp(name + ".+(critical|crippling).+(d+)", "g");

          const lcldpsMsgs = combatMsgs.filter(
            (x) => x.match(lcldpsRegex) || x.match(lclcritRegex)
          );

          if (lcldpsMsgs.length == 0) return;

          const lcldps = lcldpsMsgs.map((x) => {
            return {
              time: getDate(x),
              dmg: parseInt(x.replace(timeStampRegex, "").match(/\d+/g)[0]),
            };
          });

          const lclrecent = lcldps.filter((x) => x.time > Date.now() - 30000);

          if (lclrecent.length == 0) return;

          this.dpsNameMap[name] = {
            sampleSize: lclrecent.length,
            sampleTimeFrame: (lclrecent.slice(-1)[0].time - lclrecent[0].time) / 1000,
            dmgTotal: lclrecent.map((x) => x.dmg).reduce((a, b) => a + b, 0),
            current: (
              dmgTotal /
              ((lclrecent.slice(-1)[0].time - lclrecent[0].time) / 1000)
            ).toFixed(2),
            recentMax: Math.max(...lclrecent.map((x) => x.dmg)),
            avgDmg: (dmgTotal / this.sampleSize).toFixed(2),
          };

          // end get dps for name
        });
      },
      deep: true,
    },
  },
};
</script>

<style></style>
