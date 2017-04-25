// start an express server to serve remote control web-app file.
const express = require('express');
const remoteCtrlServer = express();
const http = require('http').Server(remoteCtrlServer);
const io = require('socket.io')(http);
const path = require('path');

const vuexStore = require('./vuex-store');
const actionFlow = require('./action-flow');

const configureServer = function() {
  // serve remote control webapp file.
  remoteCtrlServer.use('/remote', express.static(path.join(__dirname, '../remoteCtrlServer')));
}

const configureSocketIO = function() {
  io.on('connection', function(socket){
    console.log('a remote connected!');

    socket.on('action', function(action){
      console.log(`remote fire ${action} action.`);
      vuexStore.commit('CHANGE_ACTIVE', { actionFlow: actionFlow, gesture: action});
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

exports.startServer = startServer;
