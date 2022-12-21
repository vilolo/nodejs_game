import Singleton from "../base/Singleton";
import Room from "./room";


export default class RoomManager extends Singleton {
    static get Instance(){
        return super.GetInstance<RoomManager>()
    }

    nextRoomId = 1;
    idMapRoom: Map<number, Room> = new Map();

    createRoom(uid:string) {
        const room = new Room(this.nextRoomId++,uid);
        this.idMapRoom.set(room.id, room);
        return room;
    }

    joinRoom(rid: number, uid: string) {
        const room = this.getRoomById(rid);
        if (room) {
            room.join(uid);
            return room;
        }
        throw '房间ID不存在'
    }

    getRoomById(id: number) {
        return this.idMapRoom.get(id);
    }

    startRoom(rid: number) {
        const room = this.getRoomById(rid);
        if (room) {
            room.start();
        }
    }

}