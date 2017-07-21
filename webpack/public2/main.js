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
if(module.hot) {
    module.hot.accept();
}