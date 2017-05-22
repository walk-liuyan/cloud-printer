/**
 * Created by PetitKero on 15/2/2017.
 */
$(function () {
  /* AV.Object.extend('className') 所需的参数 className 则表示对应的表名*/
  var messages = new AV.Query('Messages')

  /* 定义messages字段=leancloud数据库中名为Messages的Class*/
  messages.descending('createdAt').find().then(function (res) {
    /* 按时间，升序排列query.ascending('createdAt');
     按时间，降序排列query.descending('createdAt');
     降序排序以后，用find（）方法执行匿名函数，将res（result）所有数据传入
     */
    var msgList = JSON.parse(JSON.stringify(res))
    /*
    定义 msglist=将res转成json格式
    * parse用于从一个字符串中解析出json对象,如
     var str = '{"name":"huangxiaojian","age":"23"}'
     结果：
     JSON.parse(str)
    *注意：单引号写在{}外，每个属性名都必须用双引号，否则会抛出异常。
    *
     stringify()用于从一个对象解析出字符串

    * */
    _(msgList).forEach((item) => {
      item.createdAtFormat = moment(item.createdAt).format('L')
      /*将对象中的每一组数据.自定义=将时间格式化
      * moment().format('L'); -> 2015-04-06
      * */
    })
    var text = '<% jq.each(msgList, function(index,msg) { %>' +
      '<tr> ' +
      '<td><%- msg.nickName %></td>' +
      ' <td><%- msg.content %></td> ' +
      '<td><%- msg.createdAtFormat %></td>' +
      ' </tr><% }); %>'
    var compiled = _.template(text, {'imports': {'jq': jQuery}})
    $('#msgList tbody').append(compiled({msgList: msgList}))
    /*lodash中templete中的固定用法，为了索引出leacloud中的数据，然后插入页面的table*/

  }, function (error) {
    // 异常处理
  });
  $('.messbtn').click(function () {
    var nickName = $('.nametext').val()
    var content = $('.message').val()
    if (nickName && content) {
      var MessagesObject = AV.Object.extend('Messages')
      var messagesObject = new MessagesObject()
      /*固定用法*/
      messagesObject.save({
        nickName: nickName,
        content: content,
      }).then(function (object) {
        console.log('发布留言成功', object)
        alert('发布留言成功')
        location.reload()
      })
      // 成功保存之后，页面重载
    } else {
      alert('必须填写昵称和留言内容')
    }
  })
})