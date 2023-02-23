<template>
  <h2>Target Info</h2>
  <form class="pure-form">
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
  <div class="inset" v-if="typeof mob == 'object'">
    <h4 class="mb0 mx1 flex-around">
      <span>{{ mob.name }}</span
      >|<span>{{ mob.class }}</span
      >|<span>{{ mob.race }}</span>
    </h4>
    <div>
      <tabs :mode="mode">
        <tab title="Stats">
          <dl>
            <dt>Level:</dt>
            <dd>
              {{ mob.level?.min ?? mob.level }}
              {{ mob.level?.max ? " - " + mob.level.max : "" }}
            </dd>
            <dd class="line-break"></dd>
            <dt>HP|AC|Regen:</dt>
            <dd>{{ mob.HP }} | {{ mob.AC }} | {{ mob.HP_regen }}</dd>
            <dd class="line-break"></dd>
            <dt>Attacks|DPH:</dt>
            <dd>{{ mob.attacks_per_round }} | {{ mob.damage_per_hit }}</dd>
            <dd class="line-break"></dd>
            <dt>Special:</dt>
            <dd>{{ mob.special }}</dd>
            <dd class="line-break"></dd>
            <dt>Run Speed:</dt>
            <dd>{{ mob.run_speed }}</dd>
            <dd class="line-break"></dd>
            <dt>Respawn:</dt>
            <dd>{{ mob.respawn_time }}</dd>
          </dl>
        </tab>
        <tab title="Loot"><div class="loot" v-html="mob.known_loot.trim()"></div></tab>
        <tab title="Q's / F's"
          ><h5>Quests:</h5>
          <div class="faction" v-html="mob.related_quests.trim()"></div>
          <h5>Factions:</h5>
          <div class="faction" v-html="mob.factions.trim()"></div>
          <h5>Opposing Factions:</h5>
          <div class="faction" v-html="mob.opposing_factions.trim()"></div
        ></tab>
        <tab title="Desc."><div v-html="mob.description"></div></tab>
        <tab title="Raw">
          {{ mob }}
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script>
import escapeStringRegexp from "escape-string-regexp";
import db from "@/helpers/DB";
import web from "@/helpers/web";
import { logBufferStore } from "@/stores/logbuffer";
import { logFileStore } from "@/stores/logfile";
import Tab from "./Tab.vue";
import Tabs from "./Tabs.vue";

const timeStampRegex = /\[.*\]/g;

export default {
  components: {
    Tab,
    Tabs,
  },
  setup() {
    const log = logFileStore();
    return {
      log,
    };
  },
  data() {
    return {
      name: "A Spectre",
      mob: "",
      targetphrase: "inspects %t.",
      lastLine: "",
      useEm: true,
      status: "",
      mode: "dark",
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
              this.mob = result;
            })
            .catch((err) => {
              this.status = "";
              console.log(err);
              this.mob = "ERROR: " + JSON.stringify(err, "", 2);
            });
        }
        mob = docs;
      });
    },
    parseLoot(loot) {
      console.log(loot);
      return loot;
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

dl {
  display: table;
  min-width: 100%;
}
dt,
dd {
  padding: 2% 2%;
}
dt {
  display: table-cell;
  text-align: right;
  white-space: nowrap;
  width: 40%;
  font-weight: 600;
}
dd {
  display: table-cell;
}
dd.line-break {
  display: table-row;
}

.loot ul {
  list-style: none;
}
.loot .drare {
  font-size: smaller;
}
.loot .ddb {
  font-size: smaller;
}
</style>
