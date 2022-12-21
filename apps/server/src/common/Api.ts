export interface IPlayer {
  uid: string  //是否openid
  username: string
  rid?: number
}

export enum ApiEnum{
  Test,
  PlayerJoin,
  ApiRoomCreate,
  ApiRoomJoin,
  ApiRoomStart,
}

//定义接口的名字，参数，返回值
export interface IApi {
  [ApiEnum.Test]:{
    req:{
      id: number
      nickname: string
    }
    res:{
      data?: any
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
  },
  [ApiEnum.ApiRoomCreate]:{
    req:{}
    res:{
      data?: any
    }
  },
  [ApiEnum.ApiRoomJoin]:{
    req:{rid:number}
    res:{
      data?: any
    }
  },
  [ApiEnum.ApiRoomStart]:{
    req:{rid:number}
    res:{
      data?: any
    }
  },
}