<template>
    <div class="now-playing">
        <div class="album-art-container">
            <div class="album-art"
                 v-if="albumArtBase64 !== ''"
                 v-bind:style="{ backgroundImage: 'url(data:;base64,' + albumArtBase64 + ')' }">
            </div>
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
</template>

<script>
export default {

}
</script>

<style>
.now-playing {
    display: flex;
    background-color: rgba(0, 0, 0, 0.4);
}

.album-art-container {
    width: 15vh;
    height: 15vh;
    background-color: rgba(0, 0, 0, 0.4);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}

.album-art-container .album-art {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}

.album-art-container .no-album-art {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/icon/no-album-art.png');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}

.track-info {
    width: calc((100vw - 15vh) * 0.7);
}

.track-info .track-title {
    padding-top: 5px;
    height: 50%;
    line-height: calc(15vh * 0.5);
    font-weight: 300;
    font-size: calc(15vh * 0.4);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 2%;
    padding-right: 2%;
}

.track-info .track-artist {
    height: 30%;
    line-height: calc(15vh * 0.3);
    font-weight: 100;
    font-size: calc(15vh * 0.2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 2%;
    padding-right: 2%;
}

.track-info .track-album {
    height: 30%;
    font-weight: 100;
    font-size: calc(15vh * 0.2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 2%;
    padding-right: 2%;
}

.track-control {
    width: 45vh;
    display: flex;
}

.track-control .previous-track {
    width: 15vh;
    background-image: url('../../assets/icon/previous-110-white.png');
    background-position: center;
    background-repeat: no-repeat;
}

.track-control .previous-track.focus {
    background-image: url('../../assets/icon/previous-110-white-focus.png');
}

.track-control .play-pause {
    width: 15vh;
    background-image: url('../../assets/icon/play-110-white.png');
    background-position: center;
    background-repeat: no-repeat;
}

.track-control .play-pause.focus {
    background-image: url('../../assets/icon/play-110-white-focus.png');
}

.track-control .play-pause.is-playing {
    background-image: url('../../assets/icon/pause-110-white.png');
}

.track-control .play-pause.is-playing.focus {
    background-image: url('../../assets/icon/pause-110-white-focus.png');
}

.track-control .next-track {
    width: 15vh;
    background-image: url('../../assets/icon/next-110-white.png');
    background-position: center;
    background-repeat: no-repeat;
}

.track-control .next-track.focus {
    background-image: url('../../assets/icon/next-110-white-focus.png');
}

/* ====== focus animation START ===== */
.track-control .previous-track.focus,
.track-control .play-pause.focus,
.track-control .play-pause.is-playing.focus,
.track-control .next-track.focus {
    position: relative;
    z-index: 0;
}

.track-control .previous-track.focus:before,
.track-control .play-pause.focus:before,
.track-control .play-pause.is-playing.focus:before,
.track-control .next-track.focus:before,
.track-control .previous-track.focus:after,
.track-control .play-pause.focus:after,
.track-control .play-pause.is-playing.focus:after,
.track-control .next-track.focus:after {
    opacity: 0;
    box-sizing: border-box;
    content: "\0020";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 100px;
    border: 2px solid #fff;
    box-shadow: 0 0 50px #fff, inset 0 0 50px #fff;
}

.track-control .play-pause.focus:after,
.track-control .play-pause.is-playing.focus:after {
    z-index: 1;
    animation: ripple-large 1.5s infinite 0.7s;
}

.track-control .play-pause.focus:before,
.track-control .play-pause.is-playing.focus:before {
    z-index: 2;
    animation: ripple-large 1.5s infinite;
}

.track-control .previous-track.focus:after,
.track-control .next-track.focus:after {
    z-index: 1;
    animation: ripple-small 1.5s infinite 0.75s;
}

.track-control .previous-track.focus:before,
.track-control .next-track.focus:before {
    z-index: 2;
    animation: ripple-small 1.5s infinite;
}

@keyframes ripple-large {
    0% {
        transform: scale(0.65);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: scale(0.95);
        opacity: 0;
    }
}

@keyframes ripple-small {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: scale(0.7);
        opacity: 0;
    }
}
/* ====== focus animation END ===== */
</style>


const fileSystem = require('fs');
const howler = require('howler');
const musicMetadata = require('musicmetadata');
const { STATUS,
        FOCUSABLE_ITEM } = require('../config-constant');

const nowPlaying = {
  template: `
    
  `,
  data: function() {
    return {
      track: null // use as reference for Howler object.
    };
  },
  methods: {
    togglePlayPause: function() {
      this.$store.commit('TOGGLE_MUSIC_PLAY_PAUSE');
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
      return this.$store.getters.isMusicPlaying;
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
