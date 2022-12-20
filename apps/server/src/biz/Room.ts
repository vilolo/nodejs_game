import Player from './Player'
import PlayerManager from './PlayerManager';

export default class Room{
    id: number;
    players: Set<Player> = new Set();

    join(uid: string) {
        const player = PlayerManager.Instance.getPlayerById(uid);
        if (player) {
            player.rid = this.id;
            this.players.add(player);
        }
    }
}