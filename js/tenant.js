/**
 * Created by yangdongxue on 2017/3/30.
 * 租户管理
 */
define(['commonUtils', 'vue'], function (commonUtils, Vue) {
    var tenant = {
        tenant_data : function () {
            var tenant_vm = new Vue({
                el: '#tenant_vue',
                data: {
                    keywords: '',
                    selected: 0,
                    isShow: false,
                    noDatas: '暂无数据！',
                    datas: [],
                    activeNumber: 1,
                    pageCount: 10,
                    currentPageNum: 1,
                    unbind_account_name : '',
                    tenant_id : '',
                    accountName : 0,
                    account_options : ''
                },
                mounted: function () {
                    var $this = this;
                    // 获取列表数据
                    commonUtils.ajaxPackage('query_tenant_info', null, 'get', null, function (data) {
                        var resultData = data.data.tenant_info;
                        $this.datas=resultData;
                    });
                    //获取账户信息
                    commonUtils.ajaxPackage('query_account', null, 'get', null, function (data) {
                        var resultData = data.data.account_info;
                        $this.account_options = resultData;
                    });
                },
                methods : {
                    //查询
                    tenant_search : function () {
                        var params = {
                            name: this.keywords,
                            disabled: this.selected
                        };
                        var params = '?name=' + params.name + '&disabled=' + params.disabled;
                        console.log(params);
                        commonUtils.ajaxPackage('query_tenant_info', params, 'get', null, function (data) {
                            var resultData = data.data.tenant_info;
                            tenant_vm.datas = resultData;
                            if(resultData.length<=0) {
                                tenant_vm.isShow = true;
                            } else {
                                tenant_vm.isShow = false;
                            }
                        });
                    },
                    //解绑
                    unbind : function(tenant_id,account_name) {
                        $('#unbind').modal('show');
                        this.tenant_id = tenant_id;
                        this.unbind_account_name = account_name;
                    },
                    //绑定
                    bind : function (tenant_id) {
                        $('#bind').modal('show');
                        this.tenant_id = tenant_id;
                    },
                    //解绑保存
                    unbind_btn : function () {
                        var params = {
                            tenant_id : this.tenant_id
                        };
                        commonUtils.ajaxPackage('unbind_tenant', null, 'post', params, function (data) {
                            if(data.msg == 'success') {
                                $('#unbind').modal('hide');
                                commonUtils.ajaxPackage('query_tenant_info', null, 'get', null, function (data) {
                                    var resultData = data.data.tenant_info;
                                    tenant_vm.datas = resultData;
                                });
                            }
                            alert(data.msg);
                        });
                    },
                    //绑定保存
                    bind_btn : function () {
                        var params = {
                            account_id : this.accountName,
                            tenant_id : this.tenant_id
                        };
                        commonUtils.ajaxPackage('bind_tenant', null, 'post', params, function (data) {
                            if(data.msg == 'success') {
                                $('#bind').modal('hide');
                                commonUtils.ajaxPackage('query_tenant_info', null, 'get', null, function (data) {
                                    var resultData = data.data.tenant_info;
                                    tenant_vm.datas = resultData;
                                });
                            }
                            alert(data.msg);
                        });
                    }
                }
            });
        }
    }
    return tenant;
});
