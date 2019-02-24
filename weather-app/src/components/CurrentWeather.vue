<template>
    <div class="container content-box">
        <h1>Current weather</h1>
        <p>Location: {{location}}</p>
        <p>Temperature: {{temperature}}</p>
    </div>
</template>

<script>
    import Metolib from '../metolib/lib/metolib-bundle-2.0.4.js'

    var WfsRequestParser = new Metolib.WfsRequestParser();
    // WfsRequestParser.getData({
    //       url : url,
    //        storedQueryId : storedQueryId,
    //        requestParameter : "td,ws_10min",
    //        // Integer values are used to init dates for older browsers.
    //        // (new Date("2013-05-10T08:00:00Z")).getTime()
    //      // (new Date("2013-05-12T10:00:00Z")).getTime()
    //       begin : new Date(1368172800000),
    //       end : new Date(1368352800000),
    //       timestep : 60 * 60 * 1000,
    //        sites : ["Kaisaniemi,Helsinki", "Turku"],
    //       callback : function(data, errors) {
    //            // Handle callback data here...
    //        }
    //    });

    console.log("Here's the data");
    // console.log(WfsRequestParser)

    export default {
        data() {
            return {
                location: 'Tamperee',
                temperature: '',
            }
        },
        methods: {
            getLocation() {
                return null;
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
</style>
