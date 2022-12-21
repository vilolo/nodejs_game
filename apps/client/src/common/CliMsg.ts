import {IPlayer} from './Api'
import {IState, IClientInput} from './State'

export enum MsgEnum {
    MsgPlayerList,
    MsgGameStart,
    MsgClientSync,
    MsgServerSync,
}

export interface IMsg{
    [MsgEnum.MsgPlayerList]:IMsgPlayerList,
    [MsgEnum.MsgGameStart]:IMsgGameStart,
    [MsgEnum.MsgClientSync]:IMsgClientSync,
    [MsgEnum.MsgServerSync]:IMsgServerSync,
}

export interface IMsgPlayerList {
    list: Array<IPlayer>;
}

export interface IMsgGameStart {
    state:IState
}

export interface IMsgClientSync {
    frameId: number;
    uid: string;
    input: IClientInput;
}

export interface IMsgServerSync {
    lastFrameId: number;
    inputs: Array<IClientInput>;
}

