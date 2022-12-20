import {MyServer,MyServerEventEnum,Connection} from './core'
import {Api, ApiEnum} from './common'
import {getTime} from './utils'
import PlayerManager from './biz/PlayerManager'

//如果不在Connection定义，可以这样写
// declare module "./Core" {
//     interface Connection {
//         playerId?: number //与playerManager playerId对应，建立索引，方便移除
//     }
// }

const server = new MyServer({ port: 9988 })

server.on(MyServerEventEnum.Connect, (connection: Connection)=>{
    console.log(`${getTime()}来人|人数|${server.connections.size}`)
})

server.on(MyServerEventEnum.DisConnect, (connection: Connection) => {
    console.log(`${getTime()}走人|人数|${server.connections.size}`)
    if (connection.playerId) {
        //移除玩家
    }
})

server.setApi(ApiEnum.Test, (connection: Connection, data: Api[ApiEnum.Test]['req']): Api[ApiEnum.Test]['res'] => {
    return { data:"bbb" }
})

server.setApi(ApiEnum.PlayerJoin, (connection: Connection, data: Api[ApiEnum.PlayerJoin]['req']): Api[ApiEnum.PlayerJoin]['res'] => {
    //添加玩家
    const player = PlayerManager.Instance.createPlayer({connection, uid:data.uid, username:data.username})
    PlayerManager.Instance.syncPlayers()
    const res = {status: true, msg:'', data:player}
    return res
})

server.start();