export enum ApiEnum{
  Test
}

//定义接口的名字，参数，返回值
export interface Api {
  [ApiEnum.Test]:{
    req:{
      id: number;
      nickname: string;
    }
    res:{
      data: any;
    }
  }
}