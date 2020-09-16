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

io.on('connection',function (socket) {
    socket.on('login',data => {
        //判断此用户名是否已登录
        let user = users.find(item => item.username === data.username)
        if(user){
            socket.emit('loginError',{msg:'用户名已经存在，请换个名字'})
            console.log("登陆失败")
        }else{
            users.push(data)
            socket.emit('loginSuccess',data)
            console.log("登陆成功")
        }
    })
})