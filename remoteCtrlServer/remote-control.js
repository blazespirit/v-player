const divEl = document.getElementById('main');

const hammerGesture = new Hammer(divEl);

hammerGesture.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammerGesture.on('swipeleft', (ev) => {
  divEl.textContent = "swipe left";
});

hammerGesture.on('swiperight', (ev) => {
  divEl.textContent = "swipe right";
});

hammerGesture.on('swipeup', (ev) => {
  divEl.textContent = "swipe up";
});

hammerGesture.on('swipedown', (ev) => {
  divEl.textContent = "swipe down";
});