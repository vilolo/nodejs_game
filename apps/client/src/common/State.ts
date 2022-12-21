export interface IState {
    actors: IActor[];
}

export interface IVec2 {
    x: number;
    y: number;
}

export interface IActor {
    uid: string
    username: string
    position: IVec2
    direction: IVec2
}

// export type IClientInput = IActorMove | IWeaponShoot | ITimePast;
export type IClientInput = IActorMove;

export enum InputTypeEnum {
    //人物移动1
    ActorMove,
    WeaponShoot,
    TimePast,
}

export interface IActorMove {
    type: InputTypeEnum.ActorMove;
    uid: string;
    direction: IVec2;
    dt: number; //速度
}