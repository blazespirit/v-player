<template>
	<div class="clock">
		<div class="time">{{ hour }}:{{ minute }}</div>
		<div class="am-pm">{{ timeConvention }}</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			hour: 0,
			minute: 0,
			second: 0,
			timeConvention: '',
		};
	},
	created() {
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
	}
}
</script>

<style scoped>
.clock {
	display: flex;
	align-items: baseline;
	padding-right: 15px;
}

.time {
	text-align: right;
	padding-right: 15px;
}

.am-pm {
	font-size: 1.2rem;
}
</style>
