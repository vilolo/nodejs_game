import {WebSocket} from 'ws'
import {IApi, ApiEnum, MsgEnum,IMsg,InputTypeEnum} from './common'

const ws = new WebSocket('ws://localhost:9988')

ws.on('open', () => {
    //##connection
    //##创建 player
    //##创建房间
    //房间列表
    //##加入房间
    //房间用户
    //##开始游戏
    //同步位置

    const uid = 'uid-1'
    const username = 'username-1'

    var api:ApiEnum = ApiEnum.Test
    // const data:Api[typeof api]['req'] = {id:1,nickname:"娃哈哈"}
    const data = {id:1,nickname:"娃哈哈"}
    ws.send(JSON.stringify({"type":1,"name":api,"data": <IApi[typeof api]['req']>data}))

    console.log('== 创建 player ==')
    api = ApiEnum.PlayerJoin
    const bb = {uid:uid,username:username}
    ws.send(JSON.stringify({"type":1,"name":api,"data": <IApi[typeof api]['req']>bb}))

    console.log('== 创建房间 ==')
    api = ApiEnum.ApiRoomCreate
    const cc = {uid:uid,username:username}
    ws.send(JSON.stringify({"type":1,"name":api,"data": <IApi[typeof api]['req']>cc}))

    console.log('== 加入房间 ==')
    api = ApiEnum.ApiRoomJoin
    const dd = {rid:1}
    ws.send(JSON.stringify({"type":1,"name":api,"data": <IApi[typeof api]['req']>dd}))

    console.log('== 开始游戏 ==')
    api = ApiEnum.ApiRoomStart
    const ee = {rid:1}
    ws.send(JSON.stringify({"type":1,"name":api,"data": <IApi[typeof api]['req']>ee}))

    console.log('== 同步游戏位置 ==')
    var frameId = 1
    setInterval(() => {
        const msg = MsgEnum.MsgClientSync
        frameId++
        const ff = {
            frameId: frameId,
            uid: uid,
            input: {
                type: InputTypeEnum.ActorMove,
                uid: uid,
                direction: {x:Math.random(),y:Math.random()},
                dt: 2 //速度
            }
        }
        ws.send(JSON.stringify({"type":2,"name":msg,"data": <IMsg[typeof msg]>ff}));
    }, 1000);

})

ws.on('message', (data) => {
    const json = JSON.parse(data.toString())
    showEnumKey(json.type, json.name)
    console.log('received: %s', data);
})

function showEnumKey(type:number, enumValue:number|string) {
    var typeName : string = ''
    var key : string = ''
    if(type == 1){
        typeName = 'API'
        type kt = keyof typeof ApiEnum
        let keys = Object.keys(ApiEnum).filter((x) => ApiEnum[x as kt] == enumValue)
        key = keys.length > 0 ? keys[0] : ''
    }else{
        typeName = 'MSG'
        type kt = keyof typeof MsgEnum
        let keys = Object.keys(MsgEnum).filter((x) => MsgEnum[x as kt] == enumValue)
        key = keys.length > 0 ? keys[0] : ''
    }
    
    console.log("== %s == %s",typeName,key)
}
