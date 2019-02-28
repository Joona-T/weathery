import Vue from 'vue'
// VueResource for helping to fetch data.
import VueResource from 'vue-resource'
// Skycons includes the weather icons used in the app.
import VueSkycons from 'vue-skycons'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueSkycons, { color: '#04519b'})

// Bus for helping data flow between search function and api call components.
export const searchBus = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app')

