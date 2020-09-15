/*启动聊天的服务端程序
*/
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,() => {
    console.log("服务器启动成功了")
})

//express处理静态资源
//把public目录设置为静态资源目录就是'/'
app.use(require('express').static('public'))


app.get('/',function (req,res) {
    // res.sendFile(__dirname+'/index.html')
    res.redirect('/index.html');//重定向到/index.html
})

io.on('connection',function (socket) {
    socket.emit('news',{hello:'World'})
    socket.on('my other event',function (data) {
        console.log(data)
    })
    socket.on('hehe',function (data) {
        console.log(data)
    })
})