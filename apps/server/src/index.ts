import { MyServer, MyServerEventEnum, Connection } from './core'
import { IApi, ApiEnum } from './common'
import { getTime } from './utils'
import PlayerManager from './biz/PlayerManager'
import RoomManager from './biz/RoomManager'

//如果不在Connection定义，可以这样写
// declare module "./Core" {
//     interface Connection {
//         playerId?: number //与playerManager playerId对应，建立索引，方便移除
//     }
// }

const server = new MyServer({ port: 9988 })

server.on(MyServerEventEnum.Connect, (connection: Connection) => {
    console.log(`${getTime()}来人|人数|${server.connections.size}`)
})

server.on(MyServerEventEnum.DisConnect, (connection: Connection) => {
    console.log(`${getTime()}走人|人数|${server.connections.size}`)
    if (connection.uid) {
        //移除玩家
    }
})

server.setApi(ApiEnum.Test, (connection: Connection, data: IApi[ApiEnum.Test]['req']): IApi[ApiEnum.Test]['res'] => {
    return { data: "bbb" }
})

server.setApi(ApiEnum.PlayerJoin, (connection: Connection, data: IApi[ApiEnum.PlayerJoin]['req']): IApi[ApiEnum.PlayerJoin]['res'] => {
    //添加玩家
    const player = PlayerManager.Instance.createPlayer({ connection, uid: data.uid, username: data.username })
    PlayerManager.Instance.syncPlayers()
    const res = { status: true, msg: '', data: player }
    return res
})

server.setApi(ApiEnum.ApiRoomCreate, (connection: Connection, data: IApi[ApiEnum.ApiRoomCreate]['req']): IApi[ApiEnum.ApiRoomCreate]['res'] => {
    if (connection.uid) {
        const room = RoomManager.Instance.createRoom(connection.uid)
        return { data: room }
    } else {
        throw "用户未登录"
    }
})

server.setApi(ApiEnum.ApiRoomJoin, (connection: Connection, data: IApi[ApiEnum.ApiRoomJoin]['req']): IApi[ApiEnum.ApiRoomJoin]['res'] => {
    if (connection.uid) {
        const room = RoomManager.Instance.joinRoom(data.rid, connection.uid)
        return { data: room }
    } else {
        throw "用户未登录"
    }
})

server.setApi(ApiEnum.ApiRoomStart, (connection: Connection, data: IApi[ApiEnum.ApiRoomStart]['req']): IApi[ApiEnum.ApiRoomStart]['res'] => {
    const room = RoomManager.Instance.startRoom(data.rid)
    return { data: room }
})
server.start();