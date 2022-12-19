import {WebSocket} from 'ws'
import { EventEmitter } from "stream"
import { MyServer } from "./MyServer"
import {ApiMsgEnum, } from '../common'
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
    msgMap: Map<ApiMsgEnum, Array<IItem>> = new Map()

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

                if (this.server.apiMap.has(name)) {
                    try {
                        const cb = this.server.apiMap.get(name)
                        if(cb){
                            const res = cb.call(null, this, data)                     
                            console.log(res)
                        }
                    } catch (error) {
                        
                    }
                    
                }else{
                    console.log("no api name")
                }
                
                //todo 处理 api 和 event

                ws.send('娃哈哈');

            } catch (error) {
                console.log(`解析失败，不是合法的JSON格式：${buffer.toString()}`, error)
            }
        })
    }
}
