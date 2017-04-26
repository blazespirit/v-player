const clock = {
  template: `
    <div id="clock" @click="closeApp">
      <div class="time">{{ hour }}:{{ minute }}:{{ second }}</div>
      <div class="am-pm">{{ timeConvention }}</div>
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
};

module.exports = clock;