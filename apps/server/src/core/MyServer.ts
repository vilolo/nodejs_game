import { EventEmitter } from "stream";
import WebSocket, {WebSocketServer} from 'ws'

export interface IMyServerOptions {
    port: number;
}

export class MyServer extends EventEmitter {
    wss?: WebSocketServer;
    port: number;
    
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
        ws.on('message',(data) => {
            console.log(data.toString());
            console.log(data);
        });
        ws.send('abcc');
    }
}