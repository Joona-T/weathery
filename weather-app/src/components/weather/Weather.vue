<template>
    <div>
        <app-current-weather 
            :location="userLocation"
            :weather="currentWeather"
            :night="night">
        </app-current-weather>
        <!-- <p>{{apiQuery}}</p> -->


        <button @click="getUserCoordinates">Hit me</button>
        <!-- <app-upcoming-weather :forecasts="forecasts"></app-upcoming-weather> -->

    </div>
</template>

<script>
    import CurrentWeather from './current-weather/CurrentWeather.vue'
    import UpcomingWeather from './upcoming-weather/UpcomingWeather.vue'

    export default {
        data() {
            return {
                userLocation: 'Helsinki',
                temperature: '',

                // Each API query starts with this prefix.
                queryPrefix: 'http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple',
                // Results in retrieving one forecast dataset for every hour.
                queryTimestep: '&timestep=60',
                // Forecast data needed for the app.
                // weathersymbol3 means how the weather is percieved (e.g. cloudy, sunny).
                queryParameters: '&parameters=temperature,humidity,weathersymbol3',

                // Each hours' forecasts will be stored in this array as objects.
                forecasts: [],
                night: false,       
            }
        },
        computed: {
            queryStarttime() {
                // This returns zulu time - 1 hour.
                // It result's on FMI API giving the current hour's forecast as a first element.
                return '&starttime=' + this.calulateTime(0, 'minus');
            },
            queryEndtime() {
                // This will result in API sending forecasts for the next 6 hours if,
                // the start time is set to this.calulateTime(3, 'minus').
                return '&endtime=' + this.calulateTime(6, 'plus');
            },
            queryPlace() {
                return '&place=' + this.userLocation;
            },
            apiQuery() {
                return '' + this.queryPrefix 
                    + this.queryStarttime 
                    + this.queryEndtime 
                    + this.queryPlace 
                    + this.queryTimestep
                    + this.queryParameters;
            },
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
            fetchData() {
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

                            if(err) {
                                alert("Error occured during data retrieval.\n Error info:\n Error in parsing the XML API response.\n Error location: CurrentWeather.vue's fetchData-method.");
                            }
                        });
                    })
            },
            getUserCoordinates() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        if(position) {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;

                            this.figureOutIfNight(latitude, longitude)

                            const userMapCoordinates = latitude + "," + longitude;
                            this.getUserCity(userMapCoordinates);
                        }     
                    })
                } else {
                    alert("The browser is unable to locate you.\n Consider changin or updating your browser.")
                }
            },
            getUserCity(userMapCoordinates) {
                // Compose the api request for location information.
                const REQUEST_PREFIX = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
                const API_KEY = '&key=AIzaSyBKSpvehdl4Ty-1xRSmWjF-pSQ1tj-YO8E';
                const API_REQUEST = REQUEST_PREFIX + userMapCoordinates + API_KEY;

                // Binding the self as otherwise it will be out of scope.
                let self = this;
                this.$http.get(API_REQUEST)
                    .then(response => response.json())
                    .then(data => {
                        data.results[0].address_components.forEach((adressComp) => {
                            adressComp.types.forEach((type) => {
                                if(type === 'locality') {
                                    const city = adressComp.long_name;
                                    self.userLocation = city;
                                    self.fetchData();
                                }
                            });
                        })
                    });
            },
            calulateTime(hourDifference, direction) {
                Date.prototype.toIsoString = function() {
                    let pad = function(num) {
                        var norm = Math.floor(Math.abs(num));
                        return (norm < 10 ? '0' : '') + norm;
                    };
                    if(direction === 'minus') {
                        return this.getFullYear() +
                            '-' + pad(this.getMonth() + 1) +
                            '-' + pad(this.getDate()) +
                            'T' + pad(this.getHours() - hourDifference) +
                            ':' + pad(this.getMinutes()) +
                            ':' + pad(this.getSeconds()) +
                            'Z'
                    } else {
                        return this.getFullYear() +
                            '-' + pad(this.getMonth() + 1) +
                            '-' + pad(this.getDate()) +
                            'T' + pad(this.getHours() + hourDifference) +
                            ':' + pad(this.getMinutes()) +
                            ':' + pad(this.getSeconds()) +
                            'Z'
                    }
                }
                var dt = new Date();
                return dt.toIsoString();
            },
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
            }
        },
        created() {
            this.fetchData();
        },
        components: {
            'app-current-weather': CurrentWeather,
            'app-upcoming-weather': UpcomingWeather,
        }
    }

</script>

<style>
</style>
