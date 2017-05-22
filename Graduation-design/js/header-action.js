/**
 * Created by 刘艳 on 2017/2/17.
 */
$(document).ready(function () {

  $('#header_user_center').click(function () {
    /*判断当前是否有用户登录信息，有跳转至index;无跳转去登录*/
    /*-----------------------------------------------------------------*/
    var currentUser = AV.User.current();

    if (currentUser) {
      /*
       知识点：./ 当前目录 ../ 父级目录 / 根目录
       */
      window.location.href = "./user-center.html";
    }
    else {
      alert('您还没有登录，现跳转至登录页面')
    window.location.href = "./login.html";
    }
  })
})