import {MyServer,Connection} from './core'
import {ApiMsgEnum,TsReq,TsRes} from './common'

const server = new MyServer({ port: 9988 })

server.setApi(ApiMsgEnum.Test, (connection:Connection, data:any) : any => {
    console.log('into ApiMsgEnum.Test')
    return {"a":"b"}
})

server.setApi(ApiMsgEnum.Test, (connection: Connection, data: TsReq): TsRes => {
    return { data:"bbb" }
  })

server.start();