const divEl = document.getElementById('main');

const gesture = new Hammer(divEl);

gesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

// disable unused gestures.
gesture.get('pan').set({ enable: false });
gesture.get('pinch').set({ enable: false });
gesture.get('press').set({ enable: false });
gesture.get('rotate').set({ enable: false });

gesture.on('swipeleft', (ev) => {
  divEl.textContent = "swipe left";
});

gesture.on('swiperight', (ev) => {
  divEl.textContent = "swipe right";
});

gesture.on('swipeup', (ev) => {
  divEl.textContent = "swipe up";
});

gesture.on('swipedown', (ev) => {
  divEl.textContent = "swipe down";
});
