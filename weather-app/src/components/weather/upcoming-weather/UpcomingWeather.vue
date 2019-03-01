<template>
    <div class="upcoming-weather">
        <app-single-forecast
            v-for="(forecast, i) in trimmedForecasts"
            :temp="forecast.temperature"
            :symbol="forecast.weathersymbol3"
            :night="night"
            :hour="clockTimes[i]"
            :key="i"
            v-if="i !== 0"
            class="app-single-forecast">
        </app-single-forecast>
    </div>
</template>

<script>
    import SingleForecast from './SingleForecast.vue'

    export default {
        props: {
            forecasts: Array,
            night: Boolean,
        },
        computed: {
            // If the forecast API request goes shout and 
            // the api call sends more than 6 forecasts, trim the list.
            trimmedForecasts() {
                let trimmedForecasts = this.forecasts;
                if(trimmedForecasts.length > 6) {
                    // Remove any excess elements so that only 6 forecasts remain.
                    trimmedForecasts = trimmedForecasts.slice(0,5);
                }
                return trimmedForecasts;
            },
            // Get clock times for the next five hours.
            clockTimes() {
                let hourArray = [];
                for(let i = 0; i < 6; i++) {
                    let time = new Date();
                    time.setHours(time.getHours() + i);
                    hourArray.push(time.getHours());
                }
                return hourArray;
            }
        },
        components: {
            'app-single-forecast': SingleForecast,
        }
    }
</script>

<style>
    .upcoming-weather {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    @media only screen and (min-width: 1025px) {
        .upcoming-weather {
            max-width: 1024px;
            margin-left: auto;
            margin-right: auto;
        }
    }
    @media only screen and (min-width: 1440px) {
        .upcoming-weather {
            padding-top: 2em;
        }
    }
    @media only screen and (min-width: 1920px) {
        .upcoming-weather {
            padding-top: 4em;
        }
    }
    @media only screen and (min-width: 2560px) {
        .upcoming-weather {
            padding-top: 6em;
        }
    }
</style>
