import {WebSocket} from 'ws'
import { EventEmitter } from "stream"
import { MyServer } from "./MyServer"
import {IApi,IMsg,MsgEnum} from '../common'
import {getTime} from '../utils'

export enum ConnectionEventEnum {
    Close = "Close"
}

interface IItem {
    cb: Function
    ctx: unknown
}

export class Connection extends EventEmitter {
    server: MyServer
    ws: WebSocket
    msgMap: Map<MsgEnum, Array<IItem>> = new Map()

    uid?: string    //用户id，可能openid

    constructor(server: MyServer, ws: WebSocket){
        super()
        this.server = server
        this.ws = ws
        this.ws.on("close", (code: number, reason: Buffer) => {
            this.emit(ConnectionEventEnum.Close, code, reason.toString())
        })

        this.ws.on('message', (buffer: Buffer) => {
            try {
                const str = buffer.toString()
                console.log(`${getTime()}接收|字节数${buffer.length}|${str}`)


                const json = JSON.parse(str)
                const { name, data } = json

                //todo 处理 api(加入房间等) 和 event(游戏事件同步)
                if (json.type == 1 && this.server.apiMap.has(name)) {
                    try {
                        const cb = this.server.apiMap.get(name)
                        if(cb){
                            const res = cb.call(null, this, data)                     
                            console.log(res)
                            this.sendSuccess(name, res)
                        }
                    } catch (error) {
                        console.log('apiMap error')
                        console.log(error)
                        if(error){
                            this.sendError(name, error.toString())
                        }
                    }
                    
                }else{
                    try {
                        if (this.msgMap.has(name)) {
                            const msgList = this.msgMap.get(name)
                            if(msgList){
                                msgList.forEach(({ cb, ctx }) => cb.call(ctx, this, data))
                            }
                        }
                    } catch (error) {
                        console.log('msgMap error')
                        console.log(error)
                    }
                }

            } catch (error) {
                console.log(`解析失败，不是合法的JSON格式：${buffer.toString()}`, error)
            }
        })
    }

    //=== type 1=接口，2=事件 ===

    //api统一返回
    sendSuccess<T extends keyof IApi>(name: T, data: IApi[T]['res']){
        this.ws.send(JSON.stringify({"type":1,"name":name,"data":data}))
    }

    sendError<T extends keyof IApi>(name: T, msg:String='服务错误', data?: IApi[T]['res']){
        this.ws.send(JSON.stringify({"type":1,"name":name,"msg":msg,"data":data}))
    }

    sendMsg<T extends MsgEnum >(name:T, data:IMsg[T]){
        const msg = JSON.stringify({
            "type":2,
            name,
            data,
        })
        this.ws.send(msg)
    }

    listenMsg<T extends keyof IMsg>(name: T, cb: (connection: Connection, arg: IMsg[T]) => void, ctx: unknown) {
        if (this.msgMap.has(name)) {
            this.msgMap.get(name)?.push({ cb, ctx })
        } else {
            this.msgMap.set(name, [{ cb, ctx }])
        }
    }

    unlistenMsg<T extends keyof IMsg>(name: T, cb: (connection: Connection, arg: IMsg[T]) => void, ctx: unknown){
        if (this.msgMap.has(name)) {
            const items = this.msgMap.get(name)
            if(items){
                const index = items.findIndex((i) => cb === i.cb && i.ctx === ctx)
                index > -1 && items.splice(index, 1)
            }
        }
    }
}
