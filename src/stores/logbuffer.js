import { defineStore } from 'pinia';

export const logBufferStore = defineStore('logBuffer', {
  state: function () {
    return {
      buffer: []
    };
  },
  actions: {
    append(data) {
      this.buffer.push(data);
      if(this.buffer.length > 1000)
        this.buffer.shift();
    }
  }
});
