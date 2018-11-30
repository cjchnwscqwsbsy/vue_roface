import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App';

new Vue({
    el:'#app',
    router,
    store,
    component:{ App },
    template:'<App/>'
});
