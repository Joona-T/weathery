<template>
    <div class="content-box">

        <i class="fas fa-map-marker-alt" :class="{ pulse: pulseActive }" @click="locateUser"></i>
        <i class="fas fa-redo-alt" :class="{ spin: spinActive }" @click="refresh"></i>

        <app-current-weather 
            :location="location"
            :weather="currentWeather"
            :night="night">
        </app-current-weather>

        <app-upcoming-weather 
            :forecasts="forecasts"
            :night="night">
        </app-upcoming-weather>

        <app-weather-quotes 
            :weather="currentWeather.weathersymbol3" 
            :night="night"
            class="quotes">
        </app-weather-quotes>

    </div>
</template>

<script>
    import CurrentWeather from './current-weather/CurrentWeather.vue'
    import UpcomingWeather from './upcoming-weather/UpcomingWeather.vue'
    import WeatherQuotes from './weather-quotes/WeatherQuotes.vue'
    import { searchBus } from '../../main.js'

    // Moment library for helping with date calculations and formating.
    const moment = require('moment')

    // Each forecast API query starts with this prefix.
    const QUERY_PREFIX = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple'
    // Results in retrieving one forecast dataset for every hour.
    const QUERY_TIMESTEP = '&timestep=60'
    // Forecast data needed for the app.
    // weathersymbol3 means how the weather is percieved (e.g. cloudy, sunny).
    const QUERY_PARAMETERS = '&parameters=temperature,humidity,weathersymbol3'

    export default {
        data() {
            return {
                // The default location for the user.
                location: 'Tampere',
                // Each hours' forecasts will be stored in this array as objects.
                forecasts: [],
                // Weather icons change a bit depending on whether it's night or not.
                night: false,
                search: null,
                // Toggle classes for icon click animations.
                spinActive: false,
                pulseActive: false,
            }
        },
        computed: {
            queryStarttime() {
                // This returns zulu time - 1 hour.
                // It result's on FMI API giving the current hour's forecast as a first forecast.
                let startTime = moment.utc().subtract(1, 'hour').format();
                return '&starttime=' + startTime;
            },
            queryEndtime() {
                // This results in API sending forecasts for the next 5 hours,
                // in addition to current hour's forecast.
                let endTime = moment.utc().add(5, 'hour').format();
                return '&endtime=' + endTime;
            },
            queryPlace() {
                if(this.search) {
                    return '&place=' + this.search;
                } else {
                    return '&place=' + this.location;
                }     
            },
            // The forecast API call is done with apiQuery.
            apiQuery() {
                return '' + QUERY_PREFIX
                    + this.queryStarttime 
                    + this.queryEndtime 
                    + this.queryPlace 
                    + QUERY_TIMESTEP
                    + QUERY_PARAMETERS;
            },
            // Current hours weather.
            currentWeather() {
                if(this.forecasts.length > 1) {
                    return this.forecasts[0];
                } else {
                    return {};
                }
            }
        },
        methods: {
            // Data fetch from FMI's forecast API.
            fetchForecastData() {
                // Binding the self as otherwise it will be out of scope.
                let self = this;
                // Fetch with computed api query.
                // The response is in XML form so it will be handled with text()
                this.$http.get(this.apiQuery)
                    .then(response => response.text())
                    .then(data => {
                        // Parsing the XML and saving it as JSON object.
                        var parseString = require('xml2js').parseString;
                        parseString(data, function (err, result) {
                            const forecastObject = result;
                            
                            // The forecast data is stored in member arrays.
                            // Each member has a single forecast info (e.g. temperature) and a time for it. 
                            const memberList = forecastObject['wfs:FeatureCollection']['wfs:member'];

                            //Empty the forecasts array in case of it being already populated.
                            // This might be the case when changing forecast location.
                            self.forecasts = [];
                            // Loop through every member.
                            // Store forecast data into objects based on the forecast's time.
                            let forecastTimeHelper = '';
                            memberList.forEach(element => {
                                const memberPrefix = element['BsWfs:BsWfsElement'][0]
                                const memberTime =  memberPrefix['BsWfs:Time'][0]
                                // If new forecast time is found, initialize a new forecast object.
                                if(forecastTimeHelper !== memberTime) {
                                    let newForecast = { time: memberTime }
                                    self.forecasts.push(newForecast);
                                    forecastTimeHelper = memberTime;
                                }
                                // Save the member's forecast info into the initialized object.
                                const memberParameterName = memberPrefix['BsWfs:ParameterName'][0];
                                const memberParameterValue = memberPrefix['BsWfs:ParameterValue'][0];
                                const currentForecast = self.forecasts.length - 1;
                                self.forecasts[currentForecast][memberParameterName] = memberParameterValue;
                            })

                            // If we got this far, 
                            // API call succeeded and location name can be changed.
                            if(self.search) {
                                self.location = self.search;
                            }

                            if(err) {
                                alert("Error occured during data retrieval.\n Error info:\n Error in parsing the XML API response.\n Error location: CurrentWeather.vue's fetchForecastData-method.");
                            }
                        });
                    })
            },
            // Fetch user's geolocation (coordinates).
            getUserCoordinates() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        if(position) {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;

                            // Coordinates can be used to find out if it's nigh or not.
                            this.figureOutIfNight(latitude, longitude)

                            const userMapCoordinates = latitude + "," + longitude;
                            // Google API call is done with the coordinates. 
                            this.getUserCity(userMapCoordinates);
                        }     
                    })
                } else {
                    alert("The browser is unable to locate you.\n Consider changin or updating your browser.")
                }
            },
            // Google API call for finding out the city of the user.
            getUserCity(userMapCoordinates) {
                // Compose the api request for location information.
                const REQUEST_PREFIX = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
                // This key should be save as env variable.
                const API_KEY = '&key=AIzaSyBKSpvehdl4Ty-1xRSmWjF-pSQ1tj-YO8E';
                const API_REQUEST = REQUEST_PREFIX + userMapCoordinates + API_KEY;

                // Binding the self as otherwise it will be out of scope.
                let self = this;
                this.$http.get(API_REQUEST)
                    .then(response => response.json())
                    .then(data => {
                        // The response contains various location objects,
                        // based on the accuracy of the user's coordinates.
                        data.results[0].address_components.forEach((adressComp) => {
                            // Some responses don't contain city, so municipality
                            // can be used in that case.
                            let localityFound = false;
                            adressComp.types.forEach((type) => {
                                //Try to find city.
                                if(type === 'locality') {
                                    // If the city is found, fetch the forecast data with it.
                                    self.location = adressComp.long_name;
                                    self.fetchForecastData();
                                    localityFound = true;
                                }
                            });
                            //If city isn't found, search for next locality entity.
                            if(!localityFound)
                            adressComp.types.forEach((type) => {
                                // Try to find municipality.
                                if(type === 'administrative_area_level_3') {
                                    self.location = adressComp.long_name;
                                    self.fetchForecastData();
                                    localityFound = true;
                                }
                            });
                        })
                    });
            },
            // Use Suncalc lib for finding out whether the sun has set or not.
            figureOutIfNight(latitude, longitude) {
                const SunCalc = require('suncalc');
                const d = new Date();
                const hour = d.getHours();

                const suntimes = SunCalc.getTimes(d, latitude, longitude);
                const sunrise = suntimes.sunrise.getHours();
                const sunset = suntimes.sunset.getHours();

                if(hour > sunset || hour < sunrise) {
                    this.night = true;
                } else if (hour <= sunset && hour >= sunrise) {
                    this.night = false;
                }
            },
            // Method fired by locate button.
            // Updates UI with user's location's forecast data.
            locateUser() {
                this.search = null;
                this.getUserCoordinates();
                this.pulseActive = true;
                setTimeout(()=> { this.pulseActive = false }, 1000);
            },
            // Method fired by refresh button.
            // Makes a new API call and fetches the updated forecasts.
            refresh() {
                this.fetchForecastData();
                this.spinActive = true;
                setTimeout(()=> { this.spinActive = false }, 1500);
            }
        },
        created() {
            this.fetchForecastData();
            // When component is created, try to locate user.
            this.getUserCoordinates()
            // Also look for search results emited by header component's search bar.
            searchBus.$on('searchSubmitted', searchString => {
                this.search = searchString;
                this.fetchForecastData();
            })
        },
        components: {
            'app-current-weather': CurrentWeather,
            'app-upcoming-weather': UpcomingWeather,
            'app-weather-quotes': WeatherQuotes
        }
    }

</script>

<style>
    i {
        color: #04519b;
        position: fixed;
    }
    .fa-map-marker-alt {
        font-size: 1.7em;
        top: 2.2em;
        left: .3em;       
    }
    .pulse {
        animation: pulse .3s linear forwards;
    }
    .fa-redo-alt {
        font-size: 1.4em;
        top: 2.75em;
        right: .35em;
    }
    .spin {
        animation: spin 1s ease-out forwards;
    }
    @keyframes pulse {
        0% {
            transform: translateY(0);
        }
        65% {
            transform: translateY(2px) scaleX(1.1);

        }
        100% {
            transform: translateY(0) scaleY(1);
        }
    }
    @keyframes spin {
        from {
           transform: rotate(0deg); 
        }
        to {
            transform: rotate(360deg);
        }
    }
    .quotes {
        display: none;
    }
    @media only screen and (min-height: 568px) {
        .quotes {
            display: flex;
        }
    }
    @media only screen and (min-width: 375px) {
        .fa-map-marker-alt {
            top: 2.5em;     
        }
        .fa-redo-alt {
            font-size: 1.4em;
            top: 3.1em;
        }
    }
    @media only screen and (min-width: 411px) {
        .fa-map-marker-alt {
            top: 3.2em;
            left: .3em;     
        }
        .fa-redo-alt {
            font-size: 1.4em;
            top: 3.9em;
            right: .4em;
        }
    }
    @media only screen and (min-height: 785px) {
        .fa-map-marker-alt {
            font-size: 1.9rem;
            top: 2.8em;
            left: .4em;     
        }
        .fa-redo-alt {
            font-size: 1.6em;
            top: 3.4em;
            right: .5em;
        }
    }
    @media only screen and (min-width: 768px) {
        .fa-map-marker-alt {
            font-size: 2.3rem;
            top: 2.8em;
            left: .5em;     
        }
        .fa-redo-alt {
            font-size: 1.9em;
            top: 3.4em;
            right: .6em;
        }
    }
    @media only screen and (min-width: 1024px) {
        .fa-map-marker-alt {
            font-size: 3.2rem;
            top: 2.6em;    
        }
        .fa-redo-alt {
            font-size: 2.6em;
            top: 3.3em;
        }
    }
    @media only screen and (min-width: 1025px) {
        .content-box {
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
        }
    }

</style>

