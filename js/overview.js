/**
 * Created by yangdongxue on 2017/3/22.
 */

define(['commonUtils','vue','highcharts'],function (commonUtils,Vue,hc) {

    var index = {
        requestFullScreen : function () {
            $('.resizeBigSm img').click(function () {
                if($(this).hasClass('reBig')){
                    $(this).hide().siblings().show();
                    $('aside').animate({
                        'margin-left':'-230px'
                    });
                    var de = document.documentElement;
                    if (de.requestFullscreen) {
                        de.requestFullscreen();
                    } else if (de.mozRequestFullScreen) {
                        de.mozRequestFullScreen();
                    } else if (de.webkitRequestFullScreen) {
                        de.webkitRequestFullScreen();
                    }
                } else {
                    $(this).hide().siblings().show();
                    $('aside').animate({
                        'margin-left':'0px'
                    });
                    var de = document;
                    if (de.exitFullscreen) {
                        de.exitFullscreen();
                    } else if (de.mozCancelFullScreen) {
                        de.mozCancelFullScreen();
                    } else if (de.webkitCancelFullScreen) {
                        de.webkitCancelFullScreen();
                    }
                }

            });
        },
        revenueNums : function () {
            index.revenueData();
            index.requestFullScreen();
        },
        revenueData : function () {
            //营收
            commonUtils.ajaxPackage('query_total_revenue','?start_time='+commonUtils.current_first_day()+'&end_time='+commonUtils.current_time(),'get',null,function (data) {
                var resultData = data.data;
                var revenue = new Vue({
                    el: '#revenueNums',
                    data: {
                        revenue_total: resultData.total_revenue,
                        revenue_monthly : resultData.monthly_revenue
                    }
                });
            });
            //账单
            commonUtils.ajaxPackage('query_statement_detail ',null,'get',null,function (data) {
                var resultData = data.data;
                var bill = new Vue({
                    el: '#bill_nums',
                    data: {
                        actual_arrival: resultData.clear_statement,
                        non_arrival : resultData.not_clear_statement,
                        due_bill : resultData.deadline_statement,
                        overdue_bill : resultData.overdue_deadline_statement
                    }
                });
            });
            //账户TOP10
            commonUtils.ajaxPackage('query_top_account ',null,'get',null,function (data) {
                var resultData = data.data;
                /*var account_consume = resultData.top_not_clear_account,
                    account_arrearage = resultData.top_clear_account;
                    html='';
                for(var i=0;i<account_consume.length;i++){
                    html += '<li><span class="titleNo">'+parseInt(i+1)+'</span><span class="userTitle" title="'+account_consume[i].account_id+'">'+account_consume[i].account_id+'</span> --------- <span>'+account_consume[i].amount+'</span></li>';
                }
                $('#accountTop').append(html);

                $('.countType span').on('click',function () {
                    $('#accountTop').empty();
                    var html_consume = '',html_arrearage='';
                    if($(this).data('id') == 'consume') {
                        $(this).addClass('activeTop10').siblings().removeClass('activeConsume');
                        for(var i=0;i<account_consume.length;i++){
                            html_consume += '<li><span class="titleNo">'+parseInt(i+1)+'</span><span class="userTitle" title="'+account_consume[i].account_id+'">'+account_consume[i].account_id+'</span> --------- <span>'+account_consume[i].amount+'</span></li>';
                        }
                        $('#accountTop').append(html_consume);
                    } else {
                        $(this).addClass('activeConsume').siblings().removeClass('activeTop10');
                        for(var i=0;i<account_arrearage.length;i++){
                            html_arrearage += '<li><span class="titleNo">'+parseInt(i+1)+'</span><span class="userTitle" title="'+account_arrearage[i].account_id+'">'+account_arrearage[i].account_id+'</span> --------- <span>'+account_arrearage[i].amount+'</span></li>';
                        }
                        $('#accountTop').append(html_arrearage);
                    }
                });*/
                var account_top= new Vue({
                    el: '#accountTop',
                    data: {
                        accounts: resultData.top_not_clear_account
                    }
                });
                var count_type = new Vue({
                    el: '#count_type',
                    // 在 `methods` 对象中定义方法
                    data: {
                        isActive: true,
                        isConsume: false
                    },
                    methods: {
                        account: function (message,event) {
                            if(message == 'consume') {
                                this.isActive = true,this.isConsume=false;
                                account_top.accounts = resultData.top_not_clear_account;
                            } else {
                                this.isActive = false,this.isConsume=true;
                                account_top.accounts = resultData.top_clear_account;
                            }
                        }
                    }
                })
            });
            //营收环比趋势图
            commonUtils.ajaxPackage('query_link_relative',null,'get',null,function (data) {
                var dataResult = data.data.link_relative;
                if(dataResult.length > 0) {
                    var newAry = [];
                    for(var i=0;i<dataResult.length;i++){
                        var obj = {};
                        obj.name = dataResult[i].name;
                        obj.y = parseFloat(dataResult[i].y);
                        newAry.push(obj);
                    }
                    index.drawcolumn('drawcolumn',newAry);
                } else {
                    newAry = [{name:'2017-01',y:0},{name:'2017-02',y:0},{name:'2017-03',y:0},{name:'2017-04',y:0},{name:'2017-05',y:0},{name:'2017-06',y:0},{name:'2017-07',y:0},{name:'2017-08',y:0},{name:'2017-09',y:0},{name:'2017-10',y:0},{name:'2017-11',y:0},{name:'2017-12',y:0}];
                    index.drawcolumn('drawcolumn',newAry);
                }
            });
            //资源收入趋势图
           commonUtils.ajaxPackage('query_monthly_resource_revenue',null,'get',null,function (data) {
               var dataResult = data.data.monthly_resource_revenue;
               var dataAry=[];
               for(var i=0;i<dataResult.length;i++){
                   var obj = {};
                   obj.name = dataResult[i].resource;
                   var data_child = dataResult[i].data,newAry=[];
                   for(var j=0;j<data_child.length;j++){
                       var obj_child = {};
                       obj_child.name = data_child[j].month;
                       obj_child.y =  parseFloat(data_child[j].amount);
                       newAry.push(obj_child);
                   }
                   obj.data = newAry;
                   dataAry.push(obj);
               }
               index.drowareaChart ('drowareaChart',dataAry);
            });
            //资源收入占比
            commonUtils.ajaxPackage('query_top_resource',null,'get',null,function (data) {
                var dataResult = data.data.top_resource;
                var resultData = [],count=0;
                for(var i=0;i<dataResult.length;i++){
                    var ary = [];
                    ary.push(dataResult[i].resource);
                    ary.push(parseInt(dataResult[i].amount));
                    count +=parseInt(dataResult[i].amount);
                    resultData.push(ary);
                }
                index.drowPieChart('#drowPie',resultData,count);
            });
            //资源收入TOP10
            commonUtils.ajaxPackage('query_top_resource',null,'get',null,function (data) {
                var dataResult = data.data.top_resource;
                var resources = new Vue({
                    el: '#resource_income',
                    data: {
                        resources: dataResult
                    }
                });
                /*var html='';
                $('#resource_income').empty();
                for(var i=0;i<dataResult.length;i++){
                    html += '<li><span class="titleNo">'+parseInt(i+1)+'</span><span class="userTitle">'+dataResult[i].resource+'</span> --------- <span>'+dataResult[i].amount+'</span></li>';
                }
                $('#resource_income').append(html);*/
            });
        },
        drowareaChart : function (randerTo,data) {
            chart=new Highcharts.Chart({
                /*colors: ["#d0ba94","#a29784","#5d6a75"],*/
                chart: {
                    renderTo:randerTo,
                    type: 'spline',
                    marginTop : 30
                },
                title: {
                    text: ''
                },
                credits:{
                    enabled:false
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    layout: 'horizontal',
                    align: 'right',
                    verticalAlign: 'middle',
                    itemMarginTop:8,
                    width:400
                },
                xAxis: {
                    type: 'category',
                    tickWidth: 0,//设置刻度宽度为0 不显示
                    lineColor: '#f1f8ff',//设置x轴线的颜色
                    lineWidth: 0,
                    gridLineColor: '#f4f3f0',//纵向网格线颜色
                    gridLineWidth: 1, //纵向网格线宽度
                },
                yAxis: [{
                    title: {
                        text: ''
                    },
                    /*  gridLineColor: '#fff',//设置横向网格线*/
                    gridLineWidth: 0 ,//设置横向网格线
                    labels:{
                        enabled: true //不显示x轴上的label，数字标识
                    }
                }],
                tooltip: {
                    split: true,
                    valueSuffix: ' ',
                    crosshairs: {
                        width: 1,
                        color: '#0077fa',
                        dashStyle: 'sord'
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        },
        //绘制饼图
        drowPieChart: function (target,datas,count){
            var chart = null;
            $(target).highcharts({
                colors:["#166ec4","#32afff","#7ecafa","#a6d8f8"],
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    floating:true,
                    text: ' ',
                    useHTML:true,
                    x:-210
                },
                credits:{
                    enabled:false
                },
                tooltip: {
                    enabled: false,
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                legend: {
                    layout: 'horizontal',
                    align: 'right',
                    verticalAlign: 'middle',
                    itemMarginTop:8,
                    width:400
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        showInLegend: true,
                        dataLabels: {
                            enabled: false,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        point: {
                            events: {
                                mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                                    // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                                    chart.setTitle({
                                        text: '<p style="text-align: center;margin-top: -40px;font-size: 30px;color: #c3aa7e;">'+((e.target.y/count)*100).toFixed(1)+'%</p><p style="text-align: center;color: #a8a8a8;">'+e.target.name+'<p><p style="text-align: center;color: #a8a8a8;">'+e.target.y+'<p>'
                                    });
                                },
                                legendItemClick:function () {
                                    return false;
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '60%',
                    name: '市场份额',
                    data: datas
                }]
            }, function(c) {
                // 环形图圆心
                var centerY = c.series[0].center[1],
                    titleHeight = parseInt(c.title.styles.fontSize);
                c.setTitle({
                    y:centerY + titleHeight/2
                });
                chart = c;
            });
        },
        //绘制柱图
        drawcolumn: function(target,data){
            chart=new Highcharts.Chart({
                color:['#d0ba94'],
                chart: {
                    type: 'column',
                    renderTo:target,
                    marginTop:30
                },title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                credits:{
                    enabled:false
                },
                exporting: {
                    enabled: false
                },
                legend: {enabled: false},
                xAxis: {
                    type: 'category',
                    tickWidth: 0,//设置刻度宽度为0 不显示
                    lineColor: '#f4f3f0',//设置x轴线的颜色
                    labels: {
                        //rotation: -20,
                        // x: 2,
                        y: 25,
                        align: 'center',
                        style: {
                            fontSize: '12px',
                            fontFamily: ' Microsoft Yahe,Verdana, sans-serif'
                        }
                    }
                    //crosshair: true
                },
                yAxis: {
                    gridLineColor: '#f4f3f0',//设置横向网格线
                    gridLineWidth: 1 ,//设置横向网格线
                    min: 0,
                    title: {
                        text: ''
                    },
                    labels:{
                        enabled: true //不显示x轴上的label，数字标识
                    }
                },
                plotOptions: {
                    column: {
                        pointWidth:20,
                        borderRadius: 3,
                        dataLabels: {
                            enabled: false,// 开启数据标签
                            style:{
                                color:'#5d6a75'
                            }
                        }/*,
                         enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效*/
                    }
                },
                series: [{
                    name: '营收',
                    color:'#d0ba94',
                    data : data
                }]
            });
        }
    };
    return index;
});