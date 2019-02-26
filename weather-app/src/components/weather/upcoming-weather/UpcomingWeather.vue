<template>
    <ul class="list-group">
        <li v-for="(forecast, i) in forecasts" :key="i" class="list-group-item">{{ forecast }}</li>
    </ul>
</template>

<script>
    export default {
        props: {
            forecasts: Array
        }

    }
</script>

<style>

</style>
