const Vue = require('vue');
const Vuex = require('vuex');

const { BrowserWindow } = require('electron').remote;

const actionFlow = require('./js/action-flow'); // path relative to entry file 'index.html'.
const gesture = require('./js/gesture-action');
const menu = require('./js/menu-item');

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  state: {
    activeItem: menu.MUSIC
  },
  mutations: {
    CHANGE_ACTIVE: function(state, actionObj) { // TODO -- too messy.
      state.activeItem = actionObj.actionFlow.get(vuexStore.state.activeItem)[actionObj.gesture]();
    }
  }
});


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
  methods: {
    toggleActive: function() {
      vuexStore.commit('CHANGE_ACTIVE', 'music');
    }
  },
  computed: {
    isActive: function() {
      return vuexStore.state.activeItem === 'music';
    }
  }
});

Vue.component('movie', {
  template: '<div id="movie" v-bind:class="{ active: isActive }" @click="toggleActive"></div>',
  methods: {
    toggleActive: function() {
      vuexStore.commit('CHANGE_ACTIVE', 'movie');
    }
  },
  computed: {
    isActive: function() {
      return vuexStore.state.activeItem === 'movie';
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
const remoteCtrlServer = express();
const http = require('http').Server(remoteCtrlServer);
const io = require('socket.io')(http);
const path = require('path');

const configureServer = function() {
  // serve remote control webapp file.
  remoteCtrlServer.use('/remote', express.static(path.join(__dirname, 'remoteCtrlServer')));
}

const configureSocketIO = function() {
  io.on('connection', function(socket){
    console.log('a remote connected!');

    socket.on('action', function(action){
      console.log(`remote fire ${action} action.`);
      if (action === gesture.SWIPE_LEFT) {
        vuexStore.commit('CHANGE_ACTIVE', { actionFlow: actionFlow, gesture: gesture.SWIPE_LEFT});
      }
      else if (action === gesture.SWIPE_RIGHT) {
        vuexStore.commit('CHANGE_ACTIVE', { actionFlow: actionFlow, gesture: gesture.SWIPE_RIGHT});
      }
    });

    socket.on('disconnect', function(){
      console.log('a remote disconnected');
    });
  });
}

const listen = function(port) {
  http.listen(port, () => {
    console.log(`Remote Control Server started: http://localhost:${port}/`);
  });
}

const startServer = function() {
  configureServer();
  configureSocketIO();
  listen(3000);
}

startServer();
