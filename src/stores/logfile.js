import { defineStore } from 'pinia';

export const logFileStore = defineStore('logFile', {
  state: function () {
    return {
      path: '',
      playerName: ''
    };
  },
  actions: {
    setPath: function(newPath) {
      this.path = newPath;
    },
    setPlayerName: function(name) {
      this.playerName = name;
    }
  }
});
