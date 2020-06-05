import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/Demo.css'
import axios from 'axios'
// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token");
  return config;
})
axios.defaults.withCredentials=false;
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  //store,

  render: h => h(App)
}).$mount('#app')
