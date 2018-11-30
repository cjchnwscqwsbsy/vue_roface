import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

//webpack按需加载
// const home = r =>
//     require.ensure([],() => r(Home),'home');

const home = () =>
    import('../page/Home');

export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/home',
        },
        {
            path:'/home',
            name:'home',
            component:home
        }
    ]
});
