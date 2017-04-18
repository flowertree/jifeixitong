/**
 * Created by yangdongxue on 2017/3/29.
 * 交易管理
 */
define([],function () {
   var transaction = {
         upload_file : function () {
            $("#file_path").change(function(){
               var path=$(this).val();
               var path1 = path.lastIndexOf("\\");
               var name = path.substring(path1+1);
               $("#show_file_path").val(name);
            });
         }
   }
   return transaction;
});