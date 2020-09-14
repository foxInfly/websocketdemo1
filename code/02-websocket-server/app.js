//1.导入nodejs-websocket包；
//const定义的变量不可以修改，而且必须初始化，
//var定义的变量可以修改，如果不初始化会输出undefined，不会报错。
//.let是块级作用域，函数内部使用let定义后，对函数外部无影响。
const ws = require('nodejs-websocket')
const PORT = 3000

//2.创建一个server；
//2.1处理用户的请求；
//每次只要有用户连接，函数就会被执行，会给当前连接的用户创建一个connect对象
const server = ws.createServer(connect =>{
    console.log('有用户进来了')
    //每当接收到用户传递过来的数据，这个text时间会被触发
    connect.on('text',data=>{
        console.log('接受到了用户的数据',data)
        //给用户一个响应的数据
        // connect.send(data)
        //对用户发过来的数据，把小写转换成大写，并且拼接一点内容
        connect.send(data.toUpperCase()+'!!!')
    })

      //只要websocket连接断开，close事件就会触发
      connect.on('close',()=>{
        console.log('连接断开了')
      })

       //注册一个error，处理用户的错误信息
       connect.on('error',()=>{
        console.log('用户连接异常')
      })
})

server.listen(PORT,()=>{
    console.log('WebSocket服务启动成功了，监听了端口'+PORT)
})