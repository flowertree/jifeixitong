/**
 * Created by yangdongxue on 2017/3/20.
 */
requirejs.config({
    baseUrl: 'plugins/',
    paths: {
        jquery: 'jQuery/jQuery-2.2.0.min',
        text : 'requireJs/text',
        bootstarp:'bootstrap/js/bootstrap.min',
        highcharts:'Highcharts-5.0.7/highcharts',
        app:'../dist/js/app.min',
        vue:'vue/vue',
        vueRouter:'vue/vue-router',
        lodash:'lodash/lodash',
        commonUtils : '../js/common/commonUtils',
        aside:'../js/common/aside',
        overview:'../js/overview',
        account:'../js/account',
        tenant : '../js/tenant',
        price : '../js/price',
        discount :'../js/discount',
        transaction : '../js/transaction',
        bill : '../js/bill'
    },
    waitSeconds: 15,
    shim:{
        'bootstarp':{
            deps:['jquery']
        },
        'app':{
            deps:['jquery','bootstarp']
        },
        'highcharts':{
            deps:['jquery']
        }
    }
});
define(['jquery','app','aside','overview'],function ($, ap, aside, overview) {
    aside.activePage();
    overview.revenueNums();
});
