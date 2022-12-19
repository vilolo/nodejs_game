import {WebSocket} from 'ws'
import { EventEmitter } from "stream"
import { MyServer } from "./MyServer"
import {Api} from '../common'
import { getTime } from "../Utils"

export enum ConnectionEventEnum {
    Close = "Close",
}

interface IItem {
    cb: Function
    ctx: unknown
}

export class Connection extends EventEmitter {
    server: MyServer
    ws: WebSocket

    constructor(server: MyServer, ws: WebSocket){
        super();
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
                if (this.server.apiMap.has(name)) {
                    try {
                        const cb = this.server.apiMap.get(name)
                        if(cb){
                            const res = cb.call(null, this, data)                     
                            console.log(res)
                            this.sendSuccess(name, res)
                        }
                    } catch (error) {
                        
                    }
                    
                }else{
                    console.log("no api name")
                }

            } catch (error) {
                console.log(`解析失败，不是合法的JSON格式：${buffer.toString()}`, error)
            }
        })
    }

    //返回 api、event 统一
    sendSuccess<T extends keyof Api>(name: T, data: Api[T]['res']){
        this.ws.send(JSON.stringify({"name":name,"data":data}))
    }

    sendError<T extends keyof Api>(name: T, msg:String='服务错误', data?: Api[T]['res']){
        this.ws.send(JSON.stringify({"name":name,"msg":msg,"data":data}))
    }
}
