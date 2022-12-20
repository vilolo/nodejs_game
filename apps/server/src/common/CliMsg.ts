import {IPlayer} from '../biz/Player'
import {IState} from './State'

export enum MsgEnum {
    MsgPlayerList,
    MsgGameStart
}

export interface IMsg{
    [MsgEnum.MsgPlayerList]:IMsgPlayerList,
    [MsgEnum.MsgGameStart]:IMsgGameStart
}

export interface IMsgPlayerList {
    list: Array<IPlayer>;
}

export interface IMsgGameStart {
    state:IState
}