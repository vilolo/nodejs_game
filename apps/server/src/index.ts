import { MyServer, MyServerEventEnum, Connection } from './core'
import { IApi, ApiEnum } from './common'
import { getTime } from './utils'
import PlayerManager from './biz/PlayerManager'
import RoomManager from './biz/RoomManager'
import { exit } from 'process'

import WxPay from 'wechatpay-node-v3'; // 支持使用require
import fs from 'fs';
import request from 'superagent';

//如果不在Connection定义，可以这样写
// declare module "./Core" {
//     interface Connection {
//         playerId?: number //与playerManager playerId对应，建立索引，方便移除
//     }
// }

//== 微信支付 ==
wxpay().then(()=>{
    // process.exit()
});

// (async () => {
//     await wxpay();
//     exit();
// })();

// new Promise((resolve, reject)=>{
//     wxpay()
// }).then(function(){
//     exit()
// });


// const server = new MyServer({ port: 9988 })

// server.on(MyServerEventEnum.Connect, (connection: Connection) => {
//     console.log(`${getTime()}来人|人数|${server.connections.size}`)
// })

// server.on(MyServerEventEnum.DisConnect, (connection: Connection) => {
//     console.log(`${getTime()}走人|人数|${server.connections.size}`)
//     if (connection.uid) {
//         //移除玩家
//     }
// })

// server.setApi(ApiEnum.Test, (connection: Connection, data: IApi[ApiEnum.Test]['req']): IApi[ApiEnum.Test]['res'] => {
//     return { data: "bbb" }
// })

// server.setApi(ApiEnum.PlayerJoin, (connection: Connection, data: IApi[ApiEnum.PlayerJoin]['req']): IApi[ApiEnum.PlayerJoin]['res'] => {
//     //添加玩家
//     const player = PlayerManager.Instance.createPlayer({ connection, uid: data.uid, username: data.username })
//     PlayerManager.Instance.syncPlayers()
//     const res = { status: true, msg: '', data: player }
//     return res
// })

// server.setApi(ApiEnum.ApiRoomCreate, (connection: Connection, data: IApi[ApiEnum.ApiRoomCreate]['req']): IApi[ApiEnum.ApiRoomCreate]['res'] => {
//     if (connection.uid) {
//         const room = RoomManager.Instance.createRoom(connection.uid)
//         return { data: room }
//     } else {
//         throw "用户未登录"
//     }
// })

// server.setApi(ApiEnum.ApiRoomJoin, (connection: Connection, data: IApi[ApiEnum.ApiRoomJoin]['req']): IApi[ApiEnum.ApiRoomJoin]['res'] => {
//     if (connection.uid) {
//         const room = RoomManager.Instance.joinRoom(data.rid, connection.uid)
//         return { data: room }
//     } else {
//         throw "用户未登录"
//     }
// })

// server.setApi(ApiEnum.ApiRoomStart, (connection: Connection, data: IApi[ApiEnum.ApiRoomStart]['req']): IApi[ApiEnum.ApiRoomStart]['res'] => {
//     const room = RoomManager.Instance.startRoom(data.rid)
//     return { data: room }
// })
// server.start();

//== 微信支付 == 
async function wxpay() {
    const appid = 'wxf8a6b543961ec46f';
    const mchid = '1617408495'
    const pay = new WxPay({
        appid: appid,
        mchid: mchid,
        //为什么不能用相对路径？
        // publicKey: fs.readFileSync('G:/www/nodejs/nodejs_game/apps/server/src/resources/wxkey/apiclient_cert.pem'), // 公钥
        publicKey: fs.readFileSync('./apps/server/src/resources/wxkey/apiclient_cert.pem'),
        privateKey: fs.readFileSync('./apps/server/src/resources/wxkey/apiclient_key.pem'), // 秘钥
    });

    // 这里以h5支付为例
    try {
        // 参数介绍请看h5支付文档 https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_1.shtml
        const params = {
            appid: appid,
            mchid: mchid,
            description: '测试',
            out_trade_no: '100000',
            notify_url: 'https://weixin.qq.com/',
            amount: {
                total: 1,
            },
            scene_info: {
                payer_client_ip: '127.0.0.1',
                h5_info: {
                    type: 'Wap',
                },
            },
        };
        const nonce_str = Math.random().toString(36).substr(2, 15), // 随机字符串
            timestamp = parseInt(+new Date() / 1000 + '').toString(), // 时间戳 秒
            url = '/v3/pay/transactions/h5';

        // 获取签名
        const signature = pay.getSignature('POST', nonce_str, timestamp, url, params); // 如果是get 请求 则不需要params 参数拼接在url上 例如 /v3/pay/transactions/id/12177525012014?mchid=1230000109
        // 获取头部authorization 参数
        const authorization = pay.getAuthorization(nonce_str, timestamp, signature);

        const result = await request
            .post('https://api.mch.weixin.qq.com/v3/pay/transactions/h5')
            .send(params)
            .set({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                'Authorization': authorization,
            });

        console.log('result==========>', result.body);
    } catch (error) {
        console.log(error);
    }
}
//== 微信支付 == 