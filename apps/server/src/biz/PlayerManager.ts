import Singleton from '../base/Singleton'
import {Connection} from '../core'
import {MsgEnum} from '../common'
import Player, {IPlayer} from './Player'

export default class PlayerManager extends Singleton {
    static get Instance(){
        return super.GetInstance<PlayerManager>()
    }

    private idMapPlayers: Map<string, Player> = new Map();

    createPlayer({ connection, uid, username }: { connection: Connection, uid:string, username:string }) : IPlayer {
        const player = new Player({ uid: uid, username:username, connection});
        this.idMapPlayers.set(player.uid, player);
        return {uid,username};
    }

    getPlayerById(uid: string) {
        return this.idMapPlayers.get(uid);
    }

    syncPlayers() {
        this.idMapPlayers.forEach((player, key)=>{
            player.connection.sendMsg(MsgEnum.MsgPlayerList, { list: this.getPlayersView() });
        })
    }

    getPlayersView(players: Map<string, Player> = this.idMapPlayers) {
        return [...players].map((item) => this.getPlayerView(item[1]));
    }

    getPlayerView({ uid, username, rid }: Player) {
        return { uid, username, rid };
    }
}