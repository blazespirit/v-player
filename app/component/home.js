const musicLibrary = require('./music-library');
const movieLibrary = require('./movie-library');

const home = {
  template: `
    <div id="menu-item">
      <music></music>
      <movie></movie>
    </div>
  `,
  components: {
    'music': musicLibrary,
    'movie': movieLibrary
  }
};

module.exports = home;
