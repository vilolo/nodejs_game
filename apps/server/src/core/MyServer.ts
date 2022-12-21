import { EventEmitter } from "stream";
import WebSocket, {WebSocketServer} from 'ws'
import { Connection,ConnectionEventEnum } from "./Connection";
import {IApi, ApiEnum} from '../common'

export interface IMyServerOptions {
    port: number;
}

export enum MyServerEventEnum {
    Connect = "Connect",
    DisConnect = "DisConnect",
  }

export class MyServer extends EventEmitter {
    wss?: WebSocketServer;
    port: number;
    connections: Set<Connection> = new Set();
    apiMap: Map<keyof IApi, Function> = new Map();
    
    constructor({ port = 8080 }: Partial<IMyServerOptions>) {
        super();
        this.port = port;
    }

    start(){
        return new Promise((resolve, reject)=>{
            this.wss = new WebSocketServer({port:this.port});
            this.wss.on('connection',this.handleConnect.bind(this));
            this.wss.on("error", (e) => {
                reject(e);
            });
        
            this.wss.on("close", () => {
                console.log("MyServer 服务关闭");
            });
    
            this.wss.on("listening", () => {
                resolve(true);
            });
        })
    }

    handleConnect(ws:WebSocket){
        // ws.on('message',(data) => {
        //     console.log(data.toString());
        //     console.log(data);
        // });
        // ws.send('abcc');

        const connection = new Connection(this, ws)

        //向外告知有人来了
        this.connections.add(connection)
        this.emit(MyServerEventEnum.Connect, connection);

        //向外告知有人走了
        connection.on(ConnectionEventEnum.Close, (code: number, reason: string) => {
            this.connections.delete(connection);
            this.emit(MyServerEventEnum.DisConnect, connection, code, reason);
        });
    }

    setApi(api:ApiEnum, cb: Function) {
        this.apiMap.set(api, cb);
    }
}