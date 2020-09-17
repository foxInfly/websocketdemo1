/*启动聊天的服务端程序
*/
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//记录所有已经登录过的用户,防止登陆两个名称一样的
const users = []

server.listen(3000,() => {
    console.log("服务器启动成功了")
})

//express处理静态资源
//把public目录设置为静态资源目录就是'/'
app.use(require('express').static('public'))

//访问/首页的时候
app.get('/',function (req,res) {
    // res.sendFile(__dirname+'/index.html')
    
    res.redirect('/index.html');//重定向到/index.html
})
//socket每个用户都有一个，所以页面不能刷新，一刷新就断了，相当于重新连接
io.on('connection',function (socket) {
    socket.on('login',data => {
        //判断此用户名是否已登录
        let user = users.find(item => item.username === data.username)
        if(user){
            socket.emit('loginError',{msg:'用户名已经存在，请换个名字'})
            console.log("登陆失败")
        }else{
            users.push(data)//填入数组
            //1.告诉客户端登陆成功
            socket.emit('loginSuccess',data)
            // console.log(data.username+"：登陆成功")

            //2.告诉所有的用户，有用户加入了聊天室
            //socket.emit:告诉当前用户； io.emit：告诉所有用户
            io.emit('addUser',data)

            //3.告诉所有的用户，目前聊天室有多少人
            io.emit('userList',users)

            //把登陆成功的用户名和头像存储起来
            socket.username = data.username
            socket.avatar = data.avatar


        }
    })

    //固定的用户断开监听
    socket.on('disconnect',() => {
        //1.从用户组中删除用户
        let idx = users.findIndex(item => item.username === socket.username)
        users.splice(idx,1)//删除对应下表的用户
        //2.告诉所有用户某某退出
        io.emit('delUser',{
            username:socket.username,
            avatar:socket.avatar
        })
        //3.告诉所有人更新userList
        io.emit('userList',users)
    })

    //监听用户发来的消息
    socket.on('sendMsg',data => {
        // console.log(data)
        //1.广播给所有的用户
        io.emit('receiveMsg',data)
    })

 //监听用户发来的图片
 socket.on('sendImage',data => {
    // console.log(data)
    //1.广播给所有的用户
    io.emit('receiveImage',data)
})




})