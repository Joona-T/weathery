<template>
    <div class="container">
        <div class="row cw">
            <div class="col-6 icon-box">
                <skycon
                    :condition="symbol"
                    :width="iconSize"
                    :height="iconSize"
                    :key="symbol"/>
            </div>
            <div class="col-6 weather-info">
                <h1>{{ location }}</h1>
                <p>Humidity: {{ humidity }}%</p>
                <p class="temp">{{ temp }}<span class="cels">°C</span></p>
            </div>
        </div>
        <div class="row clock">
            <div class="col-12">
                <p>{{ clock }}</p>
            </div>
        </div>


    </div>
</template>

<script>
    import * as symbolCodes from '../weather-symbols.json'

    export default {
        props: {
            location: String,
            weather: [Object, String],
            night: Boolean,

        },
        data() {
            return {
                clock: '',
            }
        },
        computed: {
            temp() {
                return Math.round(parseFloat(this.weather.temperature));
            },
            humidity() {
                return Math.round(parseFloat(this.weather.humidity));
            },
            symbol() {
                const symbolCode = (parseInt(this.weather.weathersymbol3)).toString();
                let symbolName = "clear-day"
                if(this.night) {
                    symbolName = symbolCodes.nightSymbols[symbolCode];
                } else {
                    symbolName = symbolCodes.daySymbols[symbolCode];
                }
                return symbolName;
            },
            iconSize() {
                return 160;
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
            },
        },
        created() {
            this.startClock()
        },
    }
</script>

<style>
    h1, p {
        color: #033C73;
    }
    p {
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
    }
    .cw {
        margin-top: 3em;
    }
    .icon-box {
        text-align: center;
    }
    .weather-info {
        padding-left: 0;
    }
    .temp {
        font-size: 73px;
        margin-top: -30px;
        font-weight: bold;
    }
    .cels {
        font-size: 41px;
    }
    .clock p {
        font-size: 93px;
        text-align: center;
        font-weight: 400;
    }
</style>
