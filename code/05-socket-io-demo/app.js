
//加载http模块创建一个http服务,handler用来处理js请求
// var app = require('http').createServer(handler)
var fs = require('fs')
const http = require('http')
const app = http.createServer()


//这个被坚挺的事件要放到require('socket.io')(app)的上面
app.on('request',(req,res) => {
    fs.readFile(__dirname+'/index.html',function (err,data) {
        if(err){
            res.writeHead(500)
            return res.end('Error loading index.html')
        }

        res.writeHead(200)
        return res.end(data)
    })
})


app.listen(3000,() => {
    console.log('服务器启动成功')
})

const io = require('socket.io')(app)
//nodejs的代码
function handler(req,res) {
    fs.readFile(__dirname+'/index.html',function (err,data) {
        if(err){
            res.writeHead(500)
            return res.end('Error loading index.html')
        }

        res.writeHead(200)
        return res.end(data)
    })
}

//###2.soclet-io操作######################################
//监听用户连接的事件，socket表示用户的连接
//socket.emit()触发某个事件，同时发送数据
//socket.on()注册某个事件，浏览器和服务器可以互相注册和触发
io.on('connection',socket => {
    console.log('新用户连接了')
    //socket.emit()方法表示给浏览器发送数据
    //参数1：事件的名字
    socket.emit('send',{name:'zs'})
})

