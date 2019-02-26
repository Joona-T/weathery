<template>
    <div>
        <h1>Current weather</h1>
        <p>Location: {{ location }}</p>
        <p>{{ clock }}</p>
        <p>Temperature: {{weather.temperature}}</p>
        <p>Humidity: {{weather.humidity}}</p>
        <p>Weather symbol: {{weather.weathersymbol3}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            location: String,
            weather: [Object, String],

        },
        data() {
            return {
                clock: ''
            }
        },

        methods: {
            startClock() {
                var today = new Date();
                var h = today.getHours();
                var m = this.checkIfZeroRequired(today.getMinutes());
                this.clock = h + ":" + m;
                // Update the clock every tenth second.
                setTimeout(this.startClock, 10000)
            },
            // Adds zero in front of numbers if needed.
            checkIfZeroRequired(number) {
                if (number < 10) {
                    number = "0" + number;
                }
                return number;
            }
        },
        created() {
            this.startClock()
        }
    }
    
</script>

<style>

</style>
