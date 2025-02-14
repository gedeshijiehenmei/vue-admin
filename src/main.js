import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/Demo.css'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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
Vue.filter('dateFormat',function(originVal){

  const dt=new Date(originVal);
  const y=dt.getFullYear();
  const m=(dt.getMinutes()+1+'').padStart(2,'0');
  const d=(dt.getDate()+'').padStart(2,'0');
  const hh=(dt.getHours()+'').padStart(2,'0');
  const mm=(dt.getMinutes()+'').padStart(2,'0');
  const ss=(dt.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d}:${hh}:${mm}:${mm}`
})

Vue.use(ElementUI);
Vue.use(VueQuillEditor, /* { default global options } */)
new Vue({
  router,
  //store,

  render: h => h(App)
}).$mount('#app')
