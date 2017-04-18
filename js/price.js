/**
 * Created by yangdongxue on 2017/4/6.
 * 价格管理
 */
define(['commonUtils', 'vue'], function (commonUtils, Vue) {
    var price = {
        price_data: function () {
            var price_vm = new Vue({
                el: '#price_vue',
                data: {
                    keywords: '',
                    selected: 0,
                    isShow: false,
                    noDatas: '暂无数据！',
                    datas: [],
                    activeNumber: 1,
                    pageCount: 10,
                    currentPageNum: 1,
                    area_selected: '1',
                    area_options: '',
                    resource_selected: '1',
                    resource_options: '',
                    resource_unit : '1',
                    resource_rate : '',
                    modalDetailDatas : '',
                    modalEditDatas : '',
                    status_selected:''
                },
                mounted: function () {
                    var $this = this;
                    // 获取列表数据
                    commonUtils.ajaxPackage('query_resoure_price', null, 'get', null, function (data) {
                        var resultData = data.data.price_info;
                        $this.datas=resultData;
                    });
                    //查询区域列表
                    commonUtils.ajaxPackage('query_zone_name', null, 'get', null, function (data) {
                        var resultData = data.data.zone_list;
                        $this.area_options = resultData;
                    });
                    //查询资源列表
                    commonUtils.ajaxPackage('query_resource_name', null, 'get', null, function (data) {
                        var resultData = data.data.resource_list;
                        $this.resource_options = resultData;
                    });
                },
                methods : {
                    //新增保存
                    price_add_save : function () {
                        var params = {
                            resource_type_id: this.resource_selected,
                            zone_id: this.area_selected,
                            resource_unit: this.resource_unit,
                            price: this.resource_rate
                        };
                        console.log(params);
                        commonUtils.ajaxPackage('create_resource_price', null, 'post', params, function (data) {
                            if (data.msg == 'success') {
                                $('#price_add').modal('hide');
                                commonUtils.ajaxPackage('query_resoure_price', null, 'get', null, function (data) {
                                    var resultData = data.data.price_info;
                                    price_vm.datas = resultData;
                                });
                            }
                            alert(data.msg);
                        })
                    },
                    //分页
                    activePages: function (index) {
                        this.currentPageNum = index;
                        console.log(index);
                    },
                    prevPages: function () {
                        if (this.currentPageNum == 1) {
                            alert('当前为第一页');
                        }
                    },
                    nextPages: function () {
                        if (this.currentPageNum == this.pageCount) {
                            alert('当前为最后一页');
                        }
                    },
                    //条件查询
                    price_search: function () {
                        var params = {
                            name: this.keywords,
                            disabled: this.selected
                        };
                        var params = '?name=' + params.name + '&disabled=' + params.disabled;
                        console.log(params);
                        commonUtils.ajaxPackage('query_resoure_price', params, 'get', null, function (data) {
                             var resultData = data.data.price_info;
                            price_vm.datas = resultData;
                             if(resultData.length<=0) {
                                 price_vm.isShow = true;
                             } else {
                                 price_vm.isShow = false;
                             }
                         });
                    },
                    //详情
                    price_detail : function (event,index) {
                        $('#price_detail').modal('show');
                        this.modalDetailDatas =  [this.datas[index]];
                    },
                    //编辑
                    price_edit : function (event,index) {
                        $('#price_edit').modal('show');
                        this.modalEditDatas =  [this.datas[index]];
                        this.status_selected = this.datas[index].disabled == false ? '0' : '1';
                    },
                    //编辑保存
                    price_edit_save : function () {
                        var params = {
                            price_id : $('#price_id_edit').val(),
                            price : $('#resource_rate').val(),
                            disabled : this.status_selected
                        };
                        console.log(params);
                        commonUtils.ajaxPackage('update_resource_price', null, 'post', params, function (data) {
                            if (data.msg == 'success') {
                                $('#price_edit').modal('hide');
                                commonUtils.ajaxPackage('query_resoure_price', null, 'get', null, function (data) {
                                    var resultData = data.data.price_info;
                                    price_vm.datas = resultData;
                                });
                            } else {
                                alert(data.msg);
                            }
                        });
                    },
                    //删除
                    price_del : function (index,id) {
                        var params = {
                            price_id : id
                        };
                        console.log(params);
                        commonUtils.ajaxPackage('delete_resource_price', null, 'post', params, function (data) {
                            if (data.msg == 'success') {
                                price_vm.datas.splice(index,1);
                                alert(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        })
                    }
                }
            });
        }
    }
    return price;
});
