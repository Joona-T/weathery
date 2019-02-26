<template>
  <div id="app">
    <app-header></app-header>
    <app-weather></app-weather>
  </div>
</template>

<script>
  import Header from './components/Header.vue'
  import Weather from './components/weather/Weather.vue'

  export default {
    components: {
      'app-header': Header,
      'app-weather': Weather,
    }
  }
</script>

<style>
</style>
