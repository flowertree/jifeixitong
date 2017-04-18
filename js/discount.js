/**
 * Created by yangdongxue on 2017/4/6.
 * 折扣管理
 */
define(['commonUtils','vue'], function (commonUtils,Vue) {
    var discount = {
        mode_type: ['time', 'traffic'],
        discount_table : '',
        discount_type : '',
        table_data : function () {
            var params='?mode='+discount.mode_type[0];//默认显示时间维度的列表数据
            commonUtils.ajaxPackage('query_discount_info',params,'get',null,function (data) {
                var resultData=data.data;
                discount.discount_table=new Vue({
                    el:'#discount_table',
                    data:{
                        isShow : false,
                        noDatas : '暂无数据！',
                        datas : resultData
                    },
                    methods : {
                        //删除
                        discount_del : function (index,event) {
                            var $this = this;
                            var params_del = {
                                id : $(event.target).parents('td').siblings('#discount_id').text()
                            };
                            commonUtils.ajaxPackage('delete_discount_info',null,'post',params_del,function (data) {
                                if(data.msg == 'success') {
                                    commonUtils.ajaxPackage('query_discount_info',params,'get',null,function (data) {
                                        $this.isShow=false;
                                    });
                                    $this.datas.splice(index,1);
                                }
                                alert(data.msg);
                            })
                        },
                        //编辑
                        discount_edit: function (index,event) {
                            if (discount.discount_type.isTimeActive) {
                                $('#discount_time_edit').modal('show');
                            } else {
                                $('#discount_section_edit').modal('show');
                            }
                        },
                        //详情
                        discount_detail : function (index,event) {
                            $('#discount_detail').modal('show');
                        }
                    }
                });
                if(resultData.length<=0){
                    discount.discount_table.isShow=true;
                }
                discount.discount_type = new Vue({
                    el: '.discount_tabs',
                    data: {
                        isTimeActive: true,
                        isSectionActive: false
                    },
                    methods: {
                        discountType: function (message, event) {
                            if (message == 'time') {
                                this.isTimeActive = true, this.isSectionActive = false;
                                var params='?mode='+message;//默认显示时间维度的列表数据
                                commonUtils.ajaxPackage('query_discount_info',params,'get',null,function (data) {
                                    if(data.data.length<=0){
                                        discount.discount_table.isShow=true;
                                    } else {
                                        discount.discount_table.isShow=false;
                                    }
                                    discount.discount_table.datas = data.data;
                                });
                            } else {
                                this.isTimeActive = false, this.isSectionActive = true;
                                var params='?mode='+message;//默认显示时间维度的列表数据
                                commonUtils.ajaxPackage('query_discount_info',params,'get',null,function (data) {
                                    if(data.data.length<=0){
                                        discount.discount_table.isShow=true;
                                    }
                                    discount.discount_table.datas = data.data;
                                });
                            }
                        }
                    }
                });
            });
            //按条件查询筛选出列表数据
            var discountSearch=new Vue({
                el:'#discountSearch',
                methods:{
                    discount_search:function () {
                        var params = {
                            modeType:discount.mode_type[0],
                            keywords: $('#keywords').val(),
                            transactionType: $('#billType').val()
                        };
                        var params = '?name=' + params.keywords + '&disabled=' + params.transactionType+'&mode='+params.modeType;
                        commonUtils.ajaxPackage('query_discount_info', params, 'get', null, function (data) {
                            var resultData = data.data;
                            discount.discount_table.datas = resultData;
                            if(resultData.length<=0) {
                                discount.discount_table.isShow = true;
                            } else {
                                discount.discount_table.isShow = false;
                            }
                        });
                    }
                }
            });
            //新增
            $('#discount_add').on('click', function (e) {
                if (discount.discount_type.isTimeActive) {
                    $('#discount_time_add').modal('show');
                } else {
                    $('#discount_section_add').modal('show');
                }
            });
        },
        section_event: function () {
            //折扣方案运算符
            $('.discount_table').on('click', '.select_btn i', function () {
                $(this).addClass('iActive').siblings().removeClass('iActive');
            });
            //新建折扣方案
            $('.discount_scheme_add').on('click', function () {
                var html = '<tr>' +
                    '<td><input type="text" value="1"/></td>' +
                    '<td><span class="select_btn"><i class="fa fa-angle-left"></i><i class="fa fa-angle-double-left"></i><i class="fa fa-angle-double-right"></i><i class="fa fa-angle-right"></i></span></td>' +
                    '<td><input type="text" value="0"/></td>' +
                    '</tr>';
                $(this).parents('tr').before(html);
            });
        }
    }
    return discount;
});
