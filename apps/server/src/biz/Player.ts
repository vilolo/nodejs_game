import {Connection} from '../core'

export default class Player{
    uid: string  //是否openid
    username: string
    connection: Connection
    rid: number

    constructor({uid, username, connection} : Pick<Player, 'uid' | 'username' | 'connection'>){
        this.uid = uid;
        this.username = username;
        this.connection = connection;
        this.connection.uid = uid;
        this.rid = -1;
    }
}