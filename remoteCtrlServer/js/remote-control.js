const divEl = document.getElementById('main');

const gesture = new Hammer(divEl);

const socket = io();

gesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

// disable unused gestures.
gesture.get('pan').set({ enable: false });
gesture.get('pinch').set({ enable: false });
gesture.get('press').set({ enable: false });
gesture.get('rotate').set({ enable: false });

// TODO -- define the config in remote control webapp too.
gesture.on('swipeleft', (ev) => {
  divEl.textContent = "swipe left";
  socket.emit('action', 'swipeLeft');
});

gesture.on('swiperight', (ev) => {
  divEl.textContent = "swipe right";
  socket.emit('action', 'swipeRight');
});

gesture.on('swipeup', (ev) => {
  divEl.textContent = "swipe up";
  socket.emit('action', 'swipeUp');
});

gesture.on('swipedown', (ev) => {
  divEl.textContent = "swipe down";
  socket.emit('action', 'swipeDown');
});
