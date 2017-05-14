const fileSystem = require('fs');
const howler = require('howler');
const musicMetadata = require('musicmetadata');
const { STATUS,
        FOCUSABLE_ITEM } = require('../config-constant');

const nowPlaying = {
  template: `
    <div id="now-playing">
      <div class="album-art-container">
        <div class="album-art"
             v-if="albumArtBase64 !== ''"
             v-bind:style="{ backgroundImage: 'url(data:;base64,' + albumArtBase64 + ')' }"></div>
        <div v-else class="no-album-art"></div>
      </div>
      <div class="track-info">
        <div class="track-title">{{ title }}</div>
        <div class="track-artist">{{ artist }}</div>
      </div>
      <div class="track-control">
        <div class="previous-track"
             v-bind:class="{ 'focus': previousFocus }"
             @click="previousTrack">
        </div>
        <div class="play-pause"
             v-bind:class="{ 'is-playing': isPlaying, 'focus': playFocus }"
             @click="togglePlayPause">
        </div>
        <div class="next-track"
             v-bind:class="{ 'focus': nextFocus }"
             @click="nextTrack">
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      track: null // use as reference for Howler object.
    };
  },
  methods: {
    togglePlayPause: function() {
      this.$store.commit('TOGGLE_PLAY_PAUSE');
    },
    nextTrack: function() {
      this.$store.commit('NEXT_TRACK');
    },
    previousTrack:function() {
      this.$store.commit('PREVIOUS_TRACK');
    }
  },
  computed: {
    path: function() {
      return this.$store.getters.getPath;
    },
    title: function() {
      return this.$store.getters.getTitle;
    },
    artist: function() {
      return this.$store.getters.getArtist;
    },
    album: function() {
      return this.$store.getters.getAlbum;
    },
    albumArtBase64: function() {
      let albumArt = '';

      // if returned Base64 image is empty, try to parse the file to get the album art image.
      if (this.$store.getters.getAlbumArtBase64 === '') {
        if (fileSystem.existsSync(this.path)) {
          let readStream = fileSystem.createReadStream(this.path);

          musicMetadata(readStream, (err, metadata) => {
            if (err) {
              readStream.close();
              throw err;
            }
            if (metadata.picture.length > 0) {
              let albumArtBuffer = metadata.picture[0].data;
              let base64String = '';

              for (let i = 0; i < albumArtBuffer.length; i++) {
                  base64String += String.fromCharCode(albumArtBuffer[i]);
              }
              this.$store.commit('UPDATE_ALBUM_ART', window.btoa(base64String));
            }
            readStream.close(); // close stream to prevent leak.
          });
        }
      }
      else {
        albumArt = this.$store.getters.getAlbumArtBase64;
      }
      return albumArt;
    },
    fetchStatus: function() {
      return this.$store.getters.getFetchStatus;
    },
    isPlaying: function() {
      return this.$store.getters.isPlaying;
    },
    playFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.PLAY_BUTTON;
    },
    previousFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.PREVIOUS_BUTTON;
    },
    nextFocus: function() {
      return this.$store.state.focus === FOCUSABLE_ITEM.NEXT_BUTTON;
    },
  },
  watch: {
    fetchStatus: function(status) {
      if (status === STATUS.FETCH_COMPLETE && fileSystem.existsSync(this.path)) {
        Howler.unload(); // destroy previous Howl object.

        this.track = new Howl({
          src: [this.path],
          html5: true,
          autoplay: this.isPlaying,
          onend: () => {
            this.nextTrack();
          }
        });
      }
    },
    isPlaying: function(isPlaying) {
      if (isPlaying === true) {
        this.track.play();
      }
      else {
        this.track.pause();
      }
    }
  },
  created: function() { // fetch 1st song info from DB and display it.
    this.$store.commit('GET_SINGLE_TRACK');
  }
};

module.exports = nowPlaying;
