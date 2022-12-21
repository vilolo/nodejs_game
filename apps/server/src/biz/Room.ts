import Player from './Player'
import PlayerManager from './PlayerManager'
import {MsgEnum,IMsgClientSync} from '../common'
import { IState,IClientInput } from '../common/State';
import {Connection} from '../core'

export default class Room{
    id: number
    uid:string
    private idMapPlayers: Map<string, Player> = new Map();

    private pendingInput: Array<IClientInput> = [];
    private lastPlayerFrameIdMap: Map<string, number> = new Map();

    private timers: NodeJS.Timer[] = [];

    constructor(rid: number,uid:string) {
        this.id = rid;
        this.uid = uid;
    }

    join(uid: string) {
        const player = PlayerManager.Instance.getPlayerById(uid);
        if (player) {
            player.rid = this.id
            this.idMapPlayers.set(player.uid, player)
        }
    }

    leave(uid: string) {
        const player = PlayerManager.Instance.getPlayerById(uid);
        if (player) {
            player.rid = -1;

            //取消房间监听
            //   player.connection.unlistenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this);

            this.idMapPlayers.delete(uid);
            if (!this.idMapPlayers.size) {
                //关闭房间
                // RoomManager.Instance.closeRoom(this.id);
            }
        }
    }

    start() {
        const state: IState= {actors:[]}

        this.idMapPlayers.forEach((player,key)=>{
            state.actors.push({
                uid: player.uid,
                username: player.username,
                position: {x:Math.random(),y:Math.random()},
                direction: {x:Math.random(),y:Math.random()}
            })
        })

        //循环用户，开启游戏，监听事件
        this.idMapPlayers.forEach((player,key)=>{
            player.connection.sendMsg(MsgEnum.MsgGameStart, {
                state,  //todo 同步初始状态
            });

            //监听事件
            player.connection.listenMsg(MsgEnum.MsgClientSync, this.getClientMsg, this);
        })

        let t1 = setInterval(() => {
            this.sendServerMsg();
        }, 2000);
        this.timers = [t1];
    }

    getClientMsg(connection: Connection, { frameId, input }: IMsgClientSync) {
        if(connection.uid){
            this.lastPlayerFrameIdMap.set(connection.uid, frameId);
            this.pendingInput.push(input);
        }
    }

    sendServerMsg(){
        const pendingInput = this.pendingInput;
        this.pendingInput = [];

        //todo 只发最新的

        if(pendingInput.length > 0){
            console.log('== pendingInput ==')
            //循环pendingInput 保留最新帧
            this.idMapPlayers.forEach((player,key)=>{
                player.connection.sendMsg(MsgEnum.MsgServerSync, {
                    lastFrameId: this.lastPlayerFrameIdMap.get(player.uid) ?? 0,
                    inputs: pendingInput,
                });
            })
        }
    }
}