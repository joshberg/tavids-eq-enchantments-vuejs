<template>
  <div>
    <h2 class="ml-2">Configuration</h2>
    <form class="pure-form pure-form-aligned">
      <div class="pure-control-group">
        <label>Everquest Directory</label>
        <input type="file" nwdirectory @change="scanLogs" />
      </div>
      <div class="pure-control-group">
        <label>Server</label>
        <select
          v-model="server"
          :disabled="serverDisabled"
          @change="nameDisabled = false"
        >
          <option v-for="server in serverNames" :key="server">
            {{ server }}
          </option>
        </select>
      </div>
      <div class="pure-control-group">
        <label>Character Name</label>
        <select
          v-model="name"
          :disabled="nameDisabled"
          @change="
            logStore.setPath(logPath);
            logStore.setPlayerName(name);
            saveConfiguration();
          "
        >
          <option v-for="name in servers[server]" :key="name">
            {{ name }}
          </option>
        </select>
      </div>
      <div class="pure-control-group">
        <label>Selected Log File</label>
        <span>{{ logStore.path }}</span>
      </div>
    </form>
  </div>
</template>

<script>
import { logFileStore } from "@/stores/logfile.js";

const settingsPath = "./settings.json";

export default {
  setup() {
    const logStore = logFileStore();
    return { logStore };
  },
  mounted() {
    const fs = this.require("fs");
    const lclLogStore = this.logStore;
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath));
      if (settings !== undefined) {
        this.directory = settings.directory;

        this.scanLogs(null, () => {
          this.server = settings.server;
          this.nameDisabled = false;
          this.name = settings.name;

          lclLogStore.setPath(this.logPath);
          lclLogStore.setPlayerName(this.name);
        });
      }
    }
  },
  data() {
    return {
      directory: "",
      name: "",
      server: "",
      servers: {},
      serverNames: [],
      serverDisabled: true,
      nameDisabled: true,
    };
  },
  methods: {
    scanLogs(event, cb) {
      if (this.isDesktop) {
        const fs = this.require("fs");
        const path = this.require("path");
        if (event) this.directory = event.target?.files[0]?.path;
        const logsPath = path.join(this.directory, "Logs");
        try {
          if (fs.existsSync(logsPath)) {
            const files = fs.readdirSync(logsPath);
            files.forEach((file) => {
              if (file.includes("_")) {
                let name = file.split("_")[1];
                let server = file.split("_")[2].split(".")[0];

                if (!this.servers.hasOwnProperty(server)) {
                  this.servers[server] = [];
                  this.serverNames.push(server);
                  this.servers[server].push(name);
                } else if (!this.servers[server].includes(name)) {
                  this.servers[server].push(name);
                }
              }
            });
            this.serverDisabled = false;
            if (cb !== undefined && typeof cb === "function") cb();
          }
        } catch (err) {
          this.names = [];
          this.servers = [];
          this.error = true;
        }
      }
    },
    saveConfiguration() {
      const fs = this.require("fs");
      const settings = {
        directory: this.directory,
        server: this.server,
        name: this.name,
      };

      fs.writeFileSync(settingsPath, JSON.stringify(settings), {
        encoding: "utf-8",
      });
    },
  },
  computed: {
    logPath() {
      const path = this.require("path");
      return path.join(this.directory, "Logs", `eqlog_${this.name}_${this.server}.txt`);
    },
  },
};
</script>

<style></style>
