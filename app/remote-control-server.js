// start an express server to serve remote control web-app file.
const os = require('os');
const express = require('express');
const remoteCtrlServer = express();
const http = require('http').Server(remoteCtrlServer);
const io = require('socket.io')(http);
const path = require('path');
const { REMOTE_CTRL_SERVER } = require('./config-constant');

const vuexStore = require('./vuex/vuex-store');

const configureServer = function() {
  // serve remote control webapp file.
  remoteCtrlServer.use('/remote', express.static(path.join(__dirname, '../remoteCtrlServer')));
}

const configureSocketIO = function() {
  io.on('connection', function(socket){
    console.log('a remote connected!');

    socket.on('action', function(action){
      console.log(`remote fire ${action} action.`);
      vuexStore.commit('NAVIGATION_ACTION', { gesture: action });
    });

    socket.on('disconnect', function(){
      console.log('a remote disconnected');
    });
  });
}

const listen = function(port) {
  let networkInterfaces = os.networkInterfaces();
  let ipAddress = 'locahost';

  if (networkInterfaces[REMOTE_CTRL_SERVER.WLAN_NAME]) {
    let wlanArray = networkInterfaces[REMOTE_CTRL_SERVER.WLAN_NAME];
    for (let i = 0; i < wlanArray.length; i++) {
      if (wlanArray[i].family === REMOTE_CTRL_SERVER.IPV4_STR) {
        ipAddress = wlanArray[i].address;
        break;
      }
    }
  }

  http.listen(port, () => {
    console.log(`Remote Control Server started: http://${ipAddress}:${port}/`);
  });
}

const startServer = function() {
  configureServer();
  configureSocketIO();
  listen(REMOTE_CTRL_SERVER.PORT);
}

exports.startServer = startServer;
