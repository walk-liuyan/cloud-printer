/**
 * Created by 刘艳 on 2017/2/17.
 */
$(document).ready(function () {
  $('#photoFileUpload').click(function () {
    var fileUploadControl = $('#photoFileUpload')[0];
    if (fileUploadControl.files.length > 0) {
      var localFile = fileUploadControl.files[0];
      var name = 'avatar.jpg';

      var file = new AV.File(name, localFile);
      file.save().then(function(file) {
        // 文件保存成功
        console.log(file.url());
      }, function(error) {
        // 异常处理
        console.error(error);
      });
    }
  })
})