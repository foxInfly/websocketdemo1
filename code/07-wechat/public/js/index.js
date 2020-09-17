/* 聊天室的主要功能 */


//1.连接socket服务
var socket = io('http://localhost:3000')
var username,avatar

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

//4.聊天功能
$('.btn-send').on('click',() =>{
    //4.1获取聊天内
    var content = $('#content').val().trim()
    console.log("content:"+content)
    $('#content').val('')//置空
    //判断有无输入
    if(!content){
        return alert('请输入内容')
    }


    //4.2发送给服务器    
    socket.emit('sendMsg',{msg:content,username:username,avatar:avatar})

})

//5.scrollIntoView
function scrollIntoView(){
    //获取$('.box-bd')的最后一个子元素，让其地部一直可以看到
    $('.box-bd').children(':last').get(0).scrollIntoView(false)
}

//6.发送图片功能
$('#file').on('change',function(){
    var file = this.files[0]//拿到文件
    //把这个文件发送到服务器,借助H5新增的fileReader
    var fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload=function(){
       socket.emit('sendImage',{
           username:username,
           avatar:avatar,
           img:fr.result
       })
    }
})

//7.点击时，初始化jquery-emoji插件
$('.face').on('click',function(){
    $('#content').emoji({
        button:'.face',//出发表情的元素，如不指定，会自动生成一个
        showTab: false,//
        animation: 'slide',
        position: 'topRight',
        icons: [{
            name: "QQ表情",
            path: "lib/jquery-emoji/img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif"
        }]
    })
})




/* ====================== 监听事件 ======================================= */

//1.监听登录失败的请求
socket.on('loginError',data => {alert('登陆失败')})
//2.监听登录成功的请求
socket.on('loginSuccess',data => {
    console.log(data)
    //2.1隐藏登陆窗口，显示聊天窗口
    $('.login_box').fadeOut()
    $('.container').fadeIn(20,"linear")
    //2.2设置个人信息
    $('.avatar_url').attr('src',data.avatar)
    $('.username').text(data.username)
    //存储用户名头像
    username = data.username
    avatar = data.avatar
  
})

//3.监听添加用户的请求
socket.on('addUser',data => {
    //添加一条系统消息
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content"><i><b>${data.username}</b></i> 加入群聊</span>
            </p>
        </div>
    `)
})


//4.监听用户列表的消息
socket.on('userList',data => {
    //把userList中的数据动态渲染到左侧菜单中
    $('.user-list ul').html('')
    $('#userCount').text(data.length)
    data.forEach(item => {
        $('.user-list ul').append(`
            <li class="user">
                <div class="avatar"><img src="${item.avatar}" alt=""></div>
                <div class="name">${item.username}</div>
            </li>
        `)
        scrollIntoView()
    })
    
})


//5.监听用户离开的消息
socket.on('delUser',data => {
    //添加一条系统消息
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content"><i><b>${data.username}</b></i> 离开群聊</span>
            </p>
        </div>
    `)

    scrollIntoView()
})

 //6.监听服务器发来的用户的消息
 socket.on('receiveMsg',data => {
    console.log(data)
    //1.把接收到的消息加入到聊天窗口中
    if(data.username === username){
        //自己的消息
        $('.box-bd').append(`
        <div class="message-box">
            <div class="my message">
                <img src="${data.avatar}" alt="" class="avatar">
                <div class="content">
                    <div class="bubble">
                        <div class="bubble_cont">${data.msg}</div>
                    </div>
                </div>
            </div>
        </div>
    `)
    }else{
        //别人的消息
        $('.box-bd').append(`
        <div class="message-box">
            <div class="other message"></div>
                <img src="${data.avatar}" alt="" class="avatar">
                <div class="nickname">${data.username}</div>
                <div class="content">
                    <div class="bubble">
                        <div class="bubble_cont">${data.msg}</div>            
                    </div>
                </div>
            </div>
        </div>
    `)
    }
    //获取$('.box-bd')的最后一个子元素，让其地部一直可以看到
    scrollIntoView()
})

//6.监听服务器发来的用户的图片
socket.on('receiveImage',data => {
    console.log(data)
    //1.把接收到的消息加入到聊天窗口中
    if(data.username === username){
        //自己的消息
        $('.box-bd').append(`
        <div class="message-box">
            <div class="my message">
                <img src="${data.avatar}" alt="" class="avatar">
                <div class="content">
                    <div class="bubble">
                        <img src="${data.img}">                       
                    </div>
                </div>
            </div>
        </div>
    `)
    }else{
        //别人的消息
        $('.box-bd').append(`
        <div class="message-box">
            <div class="other message"></div>
                <img src="${data.avatar}" alt="" class="avatar">
                <div class="nickname">${data.username}</div>
                <div class="content">
                    <div class="bubble">
                     <img src="${data.img}">
                    </div>
                </div>
            </div>
        </div>
    `)
    }
    //等待图片加载完成,再滚动到底部
    $('.box-bd img:last').on('load',function(){
        //获取$('.box-bd')的最后一个子元素，让其地部一直可以看到
        scrollIntoView()
    })
    
    
})



