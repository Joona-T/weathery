import Vue from 'vue'
import VueResource from 'vue-resource'
import VueSkycons from 'vue-skycons'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueSkycons, { color: '#033C73' })

new Vue({
  render: h => h(App),
}).$mount('#app')
