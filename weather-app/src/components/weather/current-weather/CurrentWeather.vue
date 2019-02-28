<template>
    <div class="container content-box">
        <div class="row current-weather">
            <div class="col-6 col-xl-5 icon-box">
                <skycon
                    :condition="symbol"
                    :width="iconSize"
                    :height="iconSize"
                    :key="symbol"/>
            </div>
            <div class="col-6 col-xl-4 weather-info">
                <h1>{{ location }}</h1>
                <p class="humidity">Humidity: {{ humidity }}%</p>
                <p class="temp">{{ temp }}<span class="cels">°C</span></p>
            </div>
            <div class="col-12 col-xl-3 clock">
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
                // Find the right weather symbol from day-time or night-time list.
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
                // Change the big weather icon size based on the width of the device.
                if (window.screen.width < 375) {
                    return 150;
                } else if (window.screen.width < 411) {
                    return 175;
                } else if (window.screen.width < 768) {
                    return 190;
                } else if (window.screen.width < 1000) {
                    return 250;
                } else {
                    return 350;
                }
            }
        },
        methods: {
            // Clock shown in the app.
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
    .current-weather {
        padding-top: 1.5em;
    }
    .icon-box {
        text-align: center;
    }
    .weather-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-top: .5em;
    }
    h1, p {
        margin: 0;
        padding: 0;
        color: #044f95;
    }
    h1 {
        font-size: 2em;
        word-wrap: break-word;
    }
    h1::first-letter {
        text-transform: capitalize;
    }
    .humidity {
        margin-top: 5px;
        margin-bottom: -10px;
        font-size: 1.1em;
        font-weight: 400;
    }
    .temp {
        font-size: 4em;
        margin-top: -10px;
        font-weight: bold;
        color: #04519b;
    }
    .cels {
        font-size: 2.5rem;
    }
    .clock p {
        font-size: 5.3rem;
        text-align: center;
        font-weight: 400;
        margin-top: -25px;
        color: #04519b;
    }
    @media only screen and (min-width: 360px) and (min-height: 630px) {
        .current-weather {
            padding-top: 2.5em;
        }
        .clock p {
            margin-top: -10px;
            margin-bottom: 15px;
        }
    }
    @media only screen and (min-width: 375px) {
        .weather-info {
            padding-top: 1em;
            padding-left: 1em;
        }
        .current-weather {
            padding-top: 2em;
        }
        h1 {
            font-size: 2.2rem;
        }
        .humidity {
            font-size: 1.2rem;
        }
        .temp {
            font-size: 4.4rem;
        }
        .cels {
            font-size: 2.7rem;
        }
        .clock p {
            margin-top: -15px;
            margin-bottom: 10px;
        }
    }
    @media only screen and (min-width: 411px) {
        .clock p {
            margin-top: -5px;
            margin-bottom: 15px;
        }
    }
    @media only screen and (min-height: 785px) {
        .current-weather {
            padding-top: 4em;
        }
        h1 {
            font-size: 2.4rem;
        }
        .humidity {
            font-size: 1.4rem;
        }
        .temp {
            font-size: 5rem;
        }
        .cels {
            font-size: 3.1rem;
        }
        .clock p {
            margin-top: 0px;
            margin-bottom: .3em;
        }
    }
    @media only screen and (min-width: 768px) {
        .current-weather {
            padding-top: 4em;
        }
        h1 {
            font-size: 3.5rem;
            word-wrap: initial;
        }
        .humidity {
            font-size: 1.8rem;
            margin-top: .8em;
        }
        .temp {
            font-size: 7.5rem;
            margin-top: -12px;
        }
        .cels {
            font-size: 4rem;
        }
        .clock p {
            margin-top: -20px;
            margin-bottom: .3em;
            font-size: 8rem;
        }
    }
    @media only screen and (min-width: 1000px) {
        .current-weather {
            padding-top: 6em;
        }
        h1 {
            font-size: 4.4rem;
        }
        .humidity {
            font-size: 2.2rem;
            margin-top: 30px;
        }
        .temp {
            font-size: 9rem;
            margin-top: -12px;
        }
        .cels {
            font-size: 6rem;
        }
        .clock p {
            margin-top: -20px;
            margin-bottom: .3em;
            font-size: 10rem;
        }
    }
    @media only screen and (min-width: 1025px) {
        .current-weather {
            padding-top: 1em;
        }
        .humidity {
            margin-top: 10px;
        }
        .temp {
            margin-top: -32px;
        }
        .clock {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .clock p {
            font-size: 6rem;
            text-align: left;
        }
    }

</style>
