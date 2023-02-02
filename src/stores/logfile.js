import { defineStore } from 'pinia';

export const logFileStore = defineStore('logFile', {
  state: function () {
    return {
      path: ''
    };
  },
  actions: {
    setPath: function(newPath) {
      this.path = newPath;
    }
  }
});
