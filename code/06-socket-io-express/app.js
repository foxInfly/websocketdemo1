var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,() => {
    console.log("服务器启动成功了")
})


app.get('/',function (req,res) {
    res.sendFile(__dirname+'/index.html')
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