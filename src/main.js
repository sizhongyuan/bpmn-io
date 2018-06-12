// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import './app.less';
// import './style.css';
import './assets/css/app.css';
import './assets/css/diagram-js.css';
import './assets/css/heihei.css';
//import './niceScroll.js'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});

Vue.nextTick(() => import('./lib/index'));


