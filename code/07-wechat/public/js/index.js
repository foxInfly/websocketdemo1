/* 聊天室的主要功能 */


//1.连接socket服务
var socket = io('http://localhost:3000')


//2.登陆功能
//siblings() 方法返回被选元素的所有同级元素。
$('#login_avatar li').on('click',function() {
    $(this).addClass('now').siblings().removeClass('now')
})

//3.点击登录按钮 登录
$('#loginBtn').on('click',function(){
    //3.1获取用户名
    var username = $('#username').val().trim()
    //判断有无输入
    if(!username){
        alert('请输入用户名')
        return
    }

    //3.2获取用户选择的头像
    var avatar = $('#login_avatar li.now img').attr('src')
    if(!avatar){
        alert('请选择一个头像')
        return
    }

    //3.3把用户名，头像告诉socket io服务器，登陆了
    socket.emit('login',{username:username,avatar:avatar})

})







//监听登录失败的请求
socket.on('loginError',data => {alert('登陆失败')})
//监听登录成功的请求
socket.on('loginSuccess',data => {alert('登陆成功')})



