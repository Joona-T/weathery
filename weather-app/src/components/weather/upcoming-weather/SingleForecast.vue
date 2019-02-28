<template>
    <div class="single-forecast">
        <p>{{ hour }}:00</p>
        <skycon 
            :condition="weatherSymbol" 
            :width="iconSize" 
            :height="iconSize" 
            :key="symbol"
            class="icon-box"
        />
        <p class="temperature">{{temperature}}°C</p>
    </div>
</template>

<script>
    import * as symbolCodes from '../weather-symbols.json'

    export default {
        props: {
            temp: String,
            symbol: String,
            night: Boolean,
            hour: Number,
        },
        computed: {
            temperature() {
                return Math.round(parseFloat(this.temp));
            },
            weatherSymbol() {
                // Find out the right weather symbol.
                const symbolCode = (parseInt(this.symbol)).toString();
                let symbolName = "clear-day"
                if(this.night) {
                    symbolName = symbolCodes.nightSymbols[symbolCode];
                } else {
                    symbolName = symbolCodes.daySymbols[symbolCode];
                }
                return symbolName;
            },
            iconSize() {
                // Change the small weather icons based on the width of the device.
                if (window.screen.width < 411) {
                    return 40;
                } else if (window.screen.width < 768) {
                    return 50;
                } else if (window.screen.width < 1000) {
                    return 70;
                } else {
                    return 85;
                }
            },
        }
    }
</script>

<style>
    .single-forecast {
        display: inline-block;
    }
    .single-forecast p, .single-forecast .icon-box {
        text-align: center;
    }
    .single-forecast p {
        margin-bottom: 1px;
    }
    .single-forecast .temperature {
        font-weight: 500;
        margin-top: -4px;
    }
    @media only screen and (min-width: 411px) {
        .single-forecast p {
            margin-bottom: 2px;
            font-size: 1.3em;
        }
    }
    @media only screen and (min-height: 785px) {
        .single-forecast p {
            margin-bottom: 4px;
            font-size: 1.5em;
        }
        .fa-redo-alt {
            font-size: 1.6em;
            top: 3.4em;
            right: .5em;
        }
    }
    @media only screen and (min-width: 768px) {
        .single-forecast p {
            margin-bottom: 4px;
            font-size: 1.7em;
        }
        .single-forecast .temperature  {
            margin-top: 0px;
        }
    }
    @media only screen and (min-width: 1000px) {
        .single-forecast p {
            margin-bottom: 4px;
            font-size: 2em;
        }
        .single-forecast .temperature  {
            margin-top: 0px;
        }
    }
</style>
