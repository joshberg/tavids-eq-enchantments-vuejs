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
            logFileStore.setPath(
              this.require('path').join(directory, 'Logs', `eqlog_${name}_${server}.txt`)
            )
          "
        >
          <option v-for="name in servers[server]" :key="name">
            {{ name }}
          </option>
        </select>
      </div>
      <div class="pure-control-group">
        <label>Selected Log File</label>
        <span>{{ logFileStore.path }}</span>
      </div>
    </form>
  </div>
</template>

<script>
import { logFileStore } from "@/stores/logfile.js";

export default {
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
    scanLogs(event) {
      if (this.isDesktop) {
        const fs = this.require("fs");
        const path = this.require("path");
        this.directory = event.target?.files[0]?.path;
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
          }
        } catch (err) {
          this.names = [];
          this.servers = [];
          this.error = true;
        }
      }
    },
  },
  computed: {
    logFileStore: function () {
      return logFileStore();
    },
  },
};
</script>

<style></style>
