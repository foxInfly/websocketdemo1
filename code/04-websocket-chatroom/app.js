
const ws = require('nodejs-websocket')
const PORT = 3000

//记录当前连接上来的总的用户数量
let count = 0

//每个连接到服务器的用户，都会有一个conn
const server = ws.createServer(conn =>{
    console.log('有用户进来了')
    count++
    conn.userName=`用户${count}`
    //1.告诉所有用户，有人加入了聊天室
    broadcast(`${conn.userName}进入了聊天室`)

    conn.on('text',data=>{
        //2.当我们接收到某个用户的信息时，也要告诉所有用户，接收到的消息内容是什么
        broadcast(`${conn.userName}说：${data}`)
    })
   


    conn.on('close',()=>{
        console.log('用户关闭连接')
    })


    conn.on('error',()=>{
        console.log('连接异常')
        console--
        //3.也要告诉所有用户，谁谁离开了聊天室
        broadcast(`${conn.userName}离开了聊天室`)

    })
})

//广播，给所有的用户发送消息
function broadcast(msg) {
    server.connections.forEach(item => {
        item.send(msg)
    })
}


server.listen(PORT,()=>{
    console.log('WebSocket服务启动成功了，监听了端口'+PORT)
})