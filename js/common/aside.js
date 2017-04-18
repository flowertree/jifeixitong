/**
 * Created by yangdongxue on 2017/3/24.
 */

define([],function () {
    var aside = {
        activePage : function () {
            $('.treeview a').click(function () {
                var $this = this;
                if($(this).next('ul').length > 0) {
                    return;
                } else {
                    $(this).children('b').addClass('hover_line').parents('li').siblings().find('b').removeClass('hover_line');
                    if($(this).data("href") !='') {
                        aside.loadPage($(this).data("href"),function () {
                            var $id = $($this).data("id");
                            console.log($id);
                            switch ($id) {
                                case 'overview':
                                    require(['overview'],function (overview) {
                                        overview.revenueNums();
                                    });
                                    break;
                                case 'account':
                                    require(['account'],function (account) {
                                        account.account_data();
                                        account.add_tenant();
                                    });
                                    break;
                                case 'tenant':
                                    require(['tenant'],function (tenant) {
                                        tenant.tenant_data();
                                    });
                                    break;
                                case 'price':
                                    require(['price'],function (price) {
                                        price.price_data();
                                    });
                                    break;
                                case 'discount':
                                    require(['discount'],function (discount) {
                                        discount.table_data();
                                        discount.section_event();
                                    });
                                    break;
                                case 'transaction':
                                    require(['transaction'],function (transaction) {
                                        transaction.upload_file();
                                    });
                                    break;
                                case 'bill':

                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
                $(this).children('b').width($(this).width()-$(this).children('div').width()-20);
            });
        },
        loadPage:function (html,loadFun) {
            $('.content').load(html,loadFun);
        }
    }
    return aside;
})