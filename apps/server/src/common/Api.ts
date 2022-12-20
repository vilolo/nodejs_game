import {IPlayer} from '../biz/Player'

export enum ApiEnum{
  Test,
  PlayerJoin
}

//定义接口的名字，参数，返回值
export interface Api {
  [ApiEnum.Test]:{
    req:{
      id: number
      nickname: string
    }
    res:{
      data: any
    }
  },
  [ApiEnum.PlayerJoin]:{
    req:{
      uid: string
      username: string
    }
    res:{
      status: boolean
      msg?:string
      data?: IPlayer
    }
  }
}