<template>
    <div class="weather-quotes">
        <transition name="slide" mode="out-in">
            <p :key="quoteIndex">{{ selectedQuote }}</p>
        </transition>
    </div>
</template>

<script>
    import * as symbolCodes from '../weather-symbols.json';
    import * as quotes from './weather-quotes.json';

    export default {
        props: {
            weather: String,
            night: Boolean,
        },
        data() {
            return {
                quoteIndex: 6
            }
        },
        computed: {
            weatherName() {
                const symbolCode = (parseInt(this.weather)).toString();
                let symbolName = "clear-day"
                if(this.night) {
                    symbolName = symbolCodes.nightSymbols[symbolCode];
                } else {
                    symbolName = symbolCodes.daySymbols[symbolCode];
                }
                return symbolName;
            },
            selectedQuote() {
                if(this.weatherName) {
                    return quotes.default[this.weatherName][this.quoteIndex];
                } else {
                    return "Weather forecast for tonight: dark.";
                }
            }
        },
        methods: {
            changeQuote() {
                if(quotes.default[this.weatherName]) {
                    const quoteList = quotes.default[this.weatherName];
                    if(this.quoteIndex + 1 === quoteList.length) {
                        this.quoteIndex = 0;
                    } else {
                        this.quoteIndex++;
                    }
                }
                setTimeout(this.changeQuote, 12000);
            }
        },
        created() {
            this.changeQuote();
        }
    }

</script>

<style>
    .weather-quotes {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #343a40;
        background-image: linear-gradient(to right, #04519b, #033C73 60%, #02325f);
        background-repeat: no-repeat;
        width: 100%;
        min-height: 96px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .weather-quotes p {
        text-align: center;
        color: white;
        font-style: italic;
        font-size: .95rem;
        padding: .7rem;
    }

    .slide-enter {
        opacity: 0;
    }
    .slide-enter-active {
        animation: slide-in 1s ease-out forwards;
        transition: opacity 1s;
    }
    .slide-leave {

    }
    .slide-leave-active {
        animation: slide-out 1s ease-out forwards;
        transition: opacity 1s;
        opacity: 0;
    }

    @keyframes slide-in {
        from {
           transform: translateX(-20px); 
        }
        to {
            transform: translateX(0);
        }
    }
    @keyframes slide-out {
        from {
           transform: translateX(0); 
        }
        to {
            transform: translateX(20px);
        }
    }
    @media only screen and (min-width: 375px) {
        .weather-quotes p {
            padding: 1rem;
            font-size: 1rem;
        }
        .weather-quotes {
            min-height: 109px;
        }
    }
    @media only screen and (min-width: 411px) {
        .weather-quotes p {
            padding: 1rem;
            font-size: 1.1rem;
        }
        .weather-quotes {
            min-height: 118px;
        }
    }
    @media only screen and (min-width: 768px) {
        .weather-quotes p {
            font-size: 1.3rem;
        }
    }
    @media only screen and (min-width: 1000px) {
        .weather-quotes p {
            font-size: 1.7rem;
            padding: 1.4em;
        }
        .weather-quotes {
            min-height: 167px;
        }
    }
    @media only screen and (min-width: 1025px) {
        .weather-quotes p {
            margin-left: auto;
            margin-right: auto;
            font-size: 1.4rem;
            padding: 1em;
        }
        .weather-quotes {
            min-height: 94px;
        }
    }

</style>
