/**
 * Created by 刘艳 on 2017/2/17.
 */

$(document).ready(function () {
/*登录页面跳转至注册*/
/*-----------------------------------------------------------------*/
$('.goto_regist').click(function () {
  window.location.href = "./regist.html";
})
  /*  验证 SessionToken 是否在有效期内*/
  /*-----------------------------------------------------------------*/
  /*修改密码后，重新登录*/
  /*var currentUser = AV.User.current();
  currentUser.isAuthenticated().then(function (authenticated) {
    console.log(authenticated);
    alert('authenticated:' + authenticated)
  });*/
  /*注册事件*/
  /*-----------------------------------------------------------------*/
  $('.regist_btn').click(function () {
    var emailText = $('#email').val()
    var usernameText = $('#username').val()
    var passwordText = $('#password').val()
    var user = new AV.User();
    // 设置用户名
    user.setUsername(usernameText);
    // 设置密码
    user.setPassword(passwordText);
    // 设置邮箱
    user.setEmail(emailText);
    user.signUp(
      {
        setUsername: usernameText,
        setPassword: passwordText,
        setEmail: emailText
      }
    ).then(function (loginedUser) {
      console.log(loginedUser);
    }, function (error) {
    });
  })
  /*登录事件*/
  /*-----------------------------------------------------------------*/
  $('.login_btn').click(function () {
    var username = $('#username').val()
    var password = $('#password').val()
    AV.User.logIn(username, password).then(function (loginedUser) {
      console.log('success'+loginedUser);
      alert('登录成功,为您跳转至首页')
      window.location.href = "./index.html";
    }, function (error) {
      alert(error)
    });
  })
  /*查看当前信息*/
  /*-----------------------------------------------------------------*/
  $('#basicInfo').click(function () {
    $('.basic_info_box').css('display', 'block')
    $('.modify_password_box').css('display', 'none')
    var user = new AV.Query('_User');
    var currentUser = AV.User.current();

    var msgList = JSON.parse(JSON.stringify(currentUser))
    alert(msgList)
    alert(user)
  })
  /*修改密码*/
  /*-----------------------------------------------------------------*/
  $('#liModifyPassword').click(function () {
    $('.modify_password_box').css('display', 'block')
    /*    $(".countrybox").css('display', 'none');
     $(".indexbox").css('display', 'block');*/
  })
  $('.modify_password_btn').click(function () {
    var email = $('#email').val()
    AV.User.requestPasswordReset('myemail@example.com').then(function (success) {
      alert('已经发送重置密码的特殊链接的电子邮件至您的注册邮箱！')
    }, function (error) {
      alert('error' + error)
    });
  })
/*退出*/
/*-----------------------------------------------------------------*/
  $('#liExit').click(function () {


      if (confirm("确定退出吗？确定【跳转至主页】，取消【返回当前页面】")) {
        AV.User.logOut();
        // 现在的 currentUser 是 null 了
        var currentUser = AV.User.current();
        window.location.href = "./index.html";
      }
      else {

      }



  })
})