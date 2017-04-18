/**
 * Created by yangdongxue on 2017/3/27.
 * 通用工具类
 */
define([],function () {
   var commonUtils = {
       baseUrl : "http://10.112.2.8:8086/marauder/v1/dashboard/",	//远程地址
       ajaxPackage : function(contentUrl,param,type,datas,func,funError){ //通用ajax
           var getParam = param == null ? '' : param,
               datas = datas == null ? '' : datas;
               /*token = commonUtils.token == undefined ? '' : commonUtils.token;*/
           $.ajax({
               url: commonUtils.baseUrl+contentUrl+getParam,
               type:type,
               dataType:"json",
               async: false,
               data : datas,
               /*beforeSend: function(request) {
                   request.setRequestHeader("X-Auth-Token", token);
               },*/
               success: func,
               error : function (jqXHR, textStatus, errorThrown) {
                   console.error(jqXHR.status+':'+jqXHR.statusText)
               }
           });
       },
       //获取当前时间(年月日)
       current_time : function () {
           var date = new Date();
           var month = date.getMonth() + 1;
           var strDate = date.getDate();
           if (month >= 1 && month <= 9) {
               month = "0" + month;
           }
           if (strDate >= 0 && strDate <= 9) {
               strDate = "0" + strDate;
           }
           var currentdate = date.getFullYear() + month + strDate;
           return currentdate;
       },
       //获取当前月的第一天
       current_first_day : function () {
           var date=new Date();
           var month = date.getMonth() + 1;
           if (month >= 1 && month <= 9) {
               month = "0" + month;
           }
           var first_day = date.getFullYear() + month + '01';
           return first_day;
       },
       //获取当前月的最后一天
       current_last_day : function () {
           var date=new Date();
           var currentMonth=date.getMonth() + 1;
           var nextMonthFirstDay=new Date(date.getFullYear(),currentMonth,1);
           var oneDay=1000*60*60*24;
           var dateFormat = new Date(nextMonthFirstDay-oneDay); //标准时间
           /**
            * 将标准时间转换为本地时间并格式化
            *
            */
           var month = dateFormat.getMonth() + 1;
           var strDate = dateFormat.getDate();
           if (month >= 1 && month <= 9) {
               month = "0" + month;
           }
           if (strDate >= 0 && strDate <= 9) {
               strDate = "0" + strDate;
           }
           var last_day = dateFormat.getFullYear() + month + strDate;
           return last_day;
       }
   }
   return commonUtils;
});