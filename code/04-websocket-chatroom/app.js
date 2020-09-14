const ws = require('nodejs-websocket')
const PORT = 3000
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2

/* 分析:
    type：消息类型
        0=进入聊天室，1=离开聊天室，2=在聊天室中的人
    msg：消息的内容
    time：聊天的具体时间
 */

//记录当前连接上来的总的用户数量
let count = 0

//每个连接到服务器的用户，都会有一个conn
const server = ws.createServer(conn => {
    console.log('有用户进来了')
    count++
    conn.userName = `用户${count}`
    //1.告诉所有用户，有人加入了聊天室
    broadcast({
        type: TYPE_ENTER,
        msg: `${conn.userName}进入了聊天室`,
        time: new Date().toLocaleString()
    })

    conn.on('text', data => {
        //2.当我们接收到某个用户的信息时，也要告诉所有用户，接收到的消息内容是什么
        broadcast({
            type: TYPE_MSG,
            msg: `${conn.userName}说：${data}`,
            time: new Date().toLocaleTimeString()
        })
    })



    conn.on('close', () => {
        console.log('用户关闭连接')
        console--
        broadcast({
            type: TYPE_LEAVE,
            msg: `${conn.userName}离开了聊天室`,
            time: new Date().toLocaleString()
        })
    })


    conn.on('error', () => {
        console.log('连接异常')
        console--
        //3.也要告诉所有用户，谁谁离开了聊天室
        /* broadcast({
            type: TYPE_LEAVE,
            msg: `${conn.userName}离开了聊天室`,
            time: new Date().toLocaleString()
        }) */

    })
})

//广播，给所有的用户发送消息
function broadcast(msg) {
    server.connections.forEach(item => {
        item.send(JSON.stringify(msg))
    })
}


server.listen(PORT, () => {
    console.log('WebSocket服务启动成功了，监听了端口' + PORT)
})