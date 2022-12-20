import {IPlayer} from '../biz/Player'

export enum MsgEnum {
    MsgPlayerList
}

export interface IMsg{
    [MsgEnum.MsgPlayerList]:IMsgPlayerList
}

export interface IMsgPlayerList {
    list: Array<IPlayer>;
}