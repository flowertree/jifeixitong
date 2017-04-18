/**
 * Created by yangdongxue on 2017/3/22.
 * 账户管理
 */
define(['commonUtils','vue'],function (commonUtils,Vue) {
    var account = {
        account_data : function () {
            var account_vue = new Vue({
                el: '#account_vue',
                data: {
                    isShow: false,
                    noDatas: '暂无数据！',
                    datas: '',
                    //查询条件
                    keywords : '',
                    accountType : '',
                    //新增
                    new_account_name : '',
                    //充值账户
                    accountNameDatas : '',
                    account_name : -1,
                    //可用余额
                    available_balance : 0,
                    //充值账户id
                    recharge_account_id :'',
                    //充值金额
                    recharge_amount : '',
                    //编辑账户数据
                    modalEditDatas : '',
                    account_id : '',
                    parent_account_id : '',
                    statement_day : '',
                    overdue_cycle : '',
                    prepaid_amount : '',
                    compound : '0',
                    clear_mode : '0',
                    status : '-1'
                },
                mounted: function () {
                    var $this = this;
                    // 获取列表数据
                    commonUtils.ajaxPackage('query_account', null, 'get', null, function (data) {
                        var resultData = data.data.account_info;
                        $this.datas=resultData;
                        $this.accountNameDatas = resultData;
                    });
                },
                methods: {
                    //查询
                    account_search : function () {
                        var params = '?name='+this.keywords+'&disabled='+this.accountType;
                        commonUtils.ajaxPackage('query_account', params, 'get', null, function (data) {
                            var resultData = data.data.account_info;
                            account_vue.datas=resultData;
                            if(resultData.length<=0) {
                                account_vue.isShow = true;
                            } else {
                                account_vue.isShow = false;
                            }
                        });
                    },
                    //选择相应账户，显示相关账户的余额
                    account_select : function () {
                        this.available_balance =  this.account_name == -1 ? 0 : this.accountNameDatas[this.account_name].prepaid_amount;
                        this.recharge_account_id = this.account_name == -1 ? '' : this.accountNameDatas[this.account_name].id;
                    },
                    //账户充值
                    account_recharge : function () {
                        var params = {
                            account_id : this.recharge_account_id,
                            recharge : this.recharge_amount
                        };
                        console.log(params);
                        commonUtils.ajaxPackage('recharge_account', null, 'post', params, function (data) {
                            if (data.msg == 'success') {
                                $('#account_recharge').modal('hide');
                                commonUtils.ajaxPackage('query_account', null, 'get', null, function (data) {
                                    var resultData = data.data.account_info;
                                    account_vue.datas = resultData;
                                    if (resultData.length <= 0) {
                                        account_vue.isShow = true;
                                    } else {
                                        account_vue.isShow = false;
                                    }
                                });
                            }
                            alert(data.msg);
                        });
                    },
                    //详情
                    account_detail : function (event,index) {

                    },
                    //编辑
                    account_edit : function (event,index) {
                        $('#account_edit').modal('show');
                        this.account_id = this.datas[index].id;
                        this.parent_account_id = this.datas[index].parent_account_id;
                        this.statement_day = this.datas[index].statement_day;
                        this.overdue_cycle = this.datas[index].overdue_cycle;
                        this.prepaid_amount = this.datas[index].prepaid_amount;
                        this.compound = this.datas[index].is_compound;
                        this.clear_mode = this.datas[index].clearing_mode;
                        this.status = this.datas[index].disabled == false ? 0 : 1;
                        this.modalEditDatas = [this.datas[index]];
                    },
                    //编辑保存
                    account_edit_save : function () {
                        var params = {
                            id : this.account_id,
                            parent_account_id : this.parent_account_id,
                            overdue_cycle : this.overdue_cycle,
                            prepaid_amount : this.prepaid_amount,
                            statement_day : this.statement_day,
                            is_compound : this.compound,
                            clearing_mode : this.clear_mode,
                            disabled : this.status
                        };
                        commonUtils.ajaxPackage('update_account', null, 'post', params, function (data) {
                            if(data.msg == 'success'){
                                $('#account_edit').modal('hide');
                                commonUtils.ajaxPackage('query_account', null, 'get', null, function (data) {
                                    var resultData = data.data.account_info;
                                    account_vue.datas=resultData;
                                });
                            }
                            alert(data.msg);
                        });
                    },
                    //新增保存
                    account_add_save : function () {
                        var params = {
                            parent_account_id : this.parent_account_id,
                            overdue_cycle : this.overdue_cycle,
                            //overdue_rate : this.overdue_rate
                            prepaid_amount : this.prepaid_amount,
                            statement_day : this.statement_day,
                            is_compound : this.compound,
                            clearing_mode : this.clear_mode,
                            disabled : this.status,
                            name : this.new_account_name
                        };
                        console.log(params);
                        commonUtils.ajaxPackage('create_account', null, 'post', params, function (data) {
                            if(data.msg == 'success'){
                                $('#account_add').modal('hide');
                                commonUtils.ajaxPackage('query_account', null, 'get', null, function (data) {
                                    var resultData = data.data.account_info;
                                    account_vue.datas=resultData;
                                });
                            }
                            alert(data.msg);
                        });
                    },
                    //租户设置
                    account_tenant : function (event,index) {
                        $('#account_tenant').modal('show');
                    }


                }
            });
        },
        detail : function () {
            var account_detail = new Vue({
                el: '#detailEvent',
                methods: {
                    detail: function (event) {
                        $('.content').load('pages/account-detail.html',function () {
                            account.detail_content();
                            account.detail_back();
                        });
                    }
                }
            })
        },
        detail_content : function () {
            var account_title = new Vue({
                el: '.content_body',
                data: {
                    isAccount: true,
                    isTenant: false
                },
                methods: {
                    accountType:function(message,event) {
                        if(message=='account') {
                            this.isAccount = true,this.isTenant = false;
                        } else {
                            this.isAccount = false,this.isTenant = true;
                        }
                    }
                }
            })
        },
        detail_back : function () {
            var account_back = new Vue({
                el: '.common_search',
                methods: {
                    accountBack:function() {
                        $('.content').load('pages/account.html',function () {
                            account.detail();
                            account.add_tenant();
                        });
                    }
                }
            })
        },
        add_tenant : function () {
            $('.tenant_list').on('click','img',function () {
                if($(this).prev('input').length) {
                    $(this).parent().remove();
                } else {
                    $(this).parent().addClass('span_del');
                }

            });
            $('.new_add').on('click',function () {
                var html='<span><input type="text"/><img src="imgs/del.png" alt="删除"/></span>';
               $(this).before(html);
            });
        }
    };
    return account;
});