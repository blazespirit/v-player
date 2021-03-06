const gestureEl = document.getElementById('gesture');

const gesture = new Hammer(gestureEl);
const socket = io();

gesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

// set press trigger duration to 500ms.
gesture.get('press').set({ time: 500 });
gesture.get('pinch').set({ enable: true });

// disable unused gestures.
gesture.get('pan').set({ enable: false });
gesture.get('rotate').set({ enable: false });

// send trigerred event to v-player.
gesture.on('swipeleft', (ev) => {
  gestureEl.textContent = "swipe left";
  socket.emit('action', 'swipeLeft');
});

gesture.on('swiperight', (ev) => {
  gestureEl.textContent = "swipe right";
  socket.emit('action', 'swipeRight');
});

gesture.on('swipeup', (ev) => {
  gestureEl.textContent = "swipe up";
  socket.emit('action', 'swipeUp');
});

gesture.on('swipedown', (ev) => {
  gestureEl.textContent = "swipe down";
  socket.emit('action', 'swipeDown');
});

gesture.on('tap', (ev) => {
  gestureEl.textContent = "tap";
  socket.emit('action', 'tap');
});

gesture.on('press', (ev) => {
  gestureEl.textContent = "press";
  socket.emit('action', 'press');
});

gesture.on('pinchend', (ev) => {
  gestureEl.textContent = "pinchEnd";
  socket.emit('action', 'pinch');  
});

// Add event listener for shutdown-icon
document.getElementById('shutdown').addEventListener("click", function() {
  showPopup();
});

document.getElementById('confirm').addEventListener("click", function() {
  gestureEl.textContent = "System Shutdown...";
  socket.emit('shutdown');
  hidePopup();
});

document.getElementById('cancel').addEventListener("click", function() {
  hidePopup();
});

function showPopup() {
  let popupEl = document.getElementById('popup');
  popupEl.className = "show";
}

function hidePopup() {
  let popupEl = document.getElementById('popup');
  popupEl.className = "";
}