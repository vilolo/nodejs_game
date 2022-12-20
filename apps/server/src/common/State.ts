export interface IState {
    actors: IActor[];
}

export interface IActor {
    uid: string;
    nickname: string
}