<template>
    <div class="container content-box">
        <h1>Current weather</h1>
        <p>Location: {{ userLocation }}</p>
        <p>
            Temperature: {{ currentTemp }}
        </p>
        <button @click="fetchData">Hit me</button>
        <ul class="list-group">
            <li v-for="(forecast, i) in forecasts" :key="i" class="list-group-item">{{ forecast }}</li>
        </ul>
        <p>apiQuery: {{ apiQuery }}</p>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                userLocation: 'Tampere',
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
            }
        },
        computed: {
            queryStarttime() {
                // This returns zulu time - 1 hour.
                // It result's on FMI API giving the current hour's forecast as a first element.
                return '&starttime=' + this.calulateTime(3, 'minus');
            },
            queryEndtime() {
                // This will result in API sending forecasts for the next 6 hours if,
                // the start time is set to this.calulateTime(3, 'minus').
                return '&endtime=' + this.calulateTime(3, 'plus');
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
            currentTemp() {
                if(this.forecasts.length > 1) {
                    return this.forecasts[0].temperature;
                } else {
                    return '?';
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
            }
        }
    }

</script>

<style>
    h1 {
        color: #033C73;
    }
    p {
        font-weight: 500;
        font-size: 1.2em;
    }
    .content-box {
        text-align: center;
        margin-top: 3em;
    }
    .content-box p {
        text-align: left;
    }
</style>
