import './css/style.scss'
import Vue from 'vue';
import App from './App'
import router from './router/router';
Vue.config.productionTip = false
new Vue({
    el:'#app',
    router,
    template:'<App/>',
    components:{App},
})
console.log(111)
if(module.hot) {
    console.log(222)
    module.hot.accept();
}