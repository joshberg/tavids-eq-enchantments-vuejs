import {
  logBufferStore
} from "@/stores/logbuffer";
import {
  readFileSync
} from "fs";
import path from "path";
import Tail from 'always-tail'

const settingsPath = "../../settings.json";
const settings = JSON.parse(readFileSync(settingsPath));
const logPath = path.join(settings.directory, "Logs", `eqlog_${settings.name}_${settings.server}.txt`);

const logBuffer = logBufferStore();

const tail = new Tail(logPath, "\n", {
  interval: 500
});

tail.on("line", (data) => {
  logBuffer.append(data);
});
tail.on("error", (err) => {
  console.log(err);
});
tail.watch();
