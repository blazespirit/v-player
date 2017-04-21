const Vue = require('vue');

const { BrowserWindow } = require('electron').remote;

Vue.component('clock', {
  template: `
    <div @click="closeApp">
      {{ hour }}:{{ minute }}:{{ second }} {{ timeConvention }}
    </div>
  `,
  data: function() {
    return {
      hour: 00,
      minute: 00,
      second: 00,
      timeConvention: '',
    };
  },
  created: function() {
    setInterval(updateClock.bind(this), 500);

    function updateClock() {
      let time = new Date();
      this.hour = time.getHours();
      this.minute = time.getMinutes();
      this.second = time.getSeconds();
      this.timeConvention = this.hour < 12 ? 'AM' : 'PM';

      // transform to 12 hours format.
      if (this.hour > 12) {
        this.hour -= 12;
      }
      if (this.hour === 0) {
        this.hour = 12;
      }

      // pad '0' infront of minutes/seconds if < 10.
      this.minute = this.minute < 10 ? '0' + this.minute : this.minute;
      this.second = this.second < 10 ? '0' + this.second : this.second;
    }
  },
  methods: {
    // TODO -- remove this afterward.
    closeApp: function() {
      BrowserWindow.getFocusedWindow().close();
    }
  }
})

Vue.component('music', {
  template: '<div id="music" v-bind:class="{ active: isActive }" @click="toggleActive"></div>',
  data: function() {
    return {
      isActive: true
    }
  },
  methods: {
    toggleActive: function() {
      this.isActive = !this.isActive;
    }
  }
});

Vue.component('movie', {
  template: '<div id="movie" v-bind:class="{ active: isActive }" @click="toggleActive"></div>',
  data: function() {
    return {
      isActive: true
    }
  },
  methods: {
    toggleActive: function() {
      this.isActive = !this.isActive;
    }
  }
});

let vm = new Vue({
  el: '#v-player',
  template: `
    <div id="v-player">
      <div id="clock">
        <clock></clock>
      </div>
      <div id="menu-item">
        <music></music>
        <movie></movie>
      </div>
    </div>
  `,
  data: {
    str1: 'movie library',
    str2: 'music library'
  }
});

// ===================== express server =====================
const express = require('express');
const path = require('path');

const remoteCtrlServer = express();

const configureServer = function() {
  // server remote control webapp file.
  remoteCtrlServer.use('/remote', express.static(path.join(__dirname, 'remoteCtrlServer')));
}

const listen = function(port) {
  remoteCtrlServer.listen(port, () => {
    console.log(`Remote Control Server started: http://localhost:${port}/`);
  });
}

const startServer = function() {
  configureServer();
  listen(3000);
}

startServer();
