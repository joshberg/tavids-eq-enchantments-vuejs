<template>
  <h2>Tells</h2>
  <form class="pure-form">
    <div class="pure-input-group">
      <label for="chimeon">Play Chime on Tell?</label>
      <input type="checkbox" v-model="isChimeOn" />
    </div>
  </form>
  <table class="pure-table pure-table-horizontal fixedheight">
    <tbody>
      <tr v-for="(tell, index) in who" :key="index">
        <td class="smalltext">{{ tell.what }}</td>
        <td>{{ tell.name }}</td>
        <td class="smalltext">{{ ((Date.now() - tell.time) / 1000).toFixed(0) }} (s)</td>
        <td>{{ tell.dest }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { logBufferStore } from "@/stores/logbuffer";
import chime from "@/assets/bell.mp3";

const timeStampRegex = /\[.*\]/g;
const tellsRegex = /tells you/g;

const getDate = (msg) => {
  let lcl = msg.match(timeStampRegex)[0];
  lcl = lcl.replace("[", "").replace("]", "");
  return Date.parse(lcl);
};

export default {
  setup() {
    const audio = new Audio(chime);
    function playChime() {
      audio.play();
    }
    return {
      playChime,
    };
  },
  data() {
    return {
      who: {},
      isChimeOn: true,
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
        let tells = newValue.buffer.filter((x) => x.match(tellsRegex));
        tells = tells.filter((x) => Date.now() - getDate(x) < 300000);
        tells.forEach((tell) => {
          let tellText = tell.split(timeStampRegex)[1];
          let name = tellText.trim().split(" tells you")[0];
          let what = tellText.split(" tells you, ")[1];
          let time = getDate(tell);
          let dest = tellText.split(" tells you,")[1].match(/\w+ to \w+/g);
          let currDest;
          if (!this.who[name] && this.isChimeOn) {
            // Play chime
            this.playChime();
          } else {
            if (this.who[name]?.dest?.length > 0) {
              currDest = this.who[name].dest;
            }
          }

          this.who[name] = {
            what,
            time,
            name,
            dest: currDest ? currDest : dest && dest.length > 0 ? dest : "",
          };
        });

        //Truncate who to tells less than 10 minutes old
        const keys = Object.keys(this.who);
        keys.forEach((key) => {
          let obj = this.who[key];
          if (Date.now() - obj.time > 600000) delete this.who[key];
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.fixedheight {
  max-height: 30vh;
  overflow-y: scroll;
  border-style: inset;
  border-width: 1px;
}
.smalltext {
  font-size: small;
}
</style>
