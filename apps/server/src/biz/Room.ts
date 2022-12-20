import Player from './Player'
import PlayerManager from './PlayerManager'
import {MsgEnum} from '../common'
import { IState } from '../common/State';

export default class Room{
    id: number;
    private idMapPlayers: Map<string, Player> = new Map();

    constructor(rid: number) {
        this.id = rid;
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
        //循环用户，开启游戏，监听事件
        this.idMapPlayers.forEach((player,key)=>{
            player.connection.sendMsg(MsgEnum.MsgGameStart, {
                state,  //todo 同步初始状态
            });
        })
    }
}