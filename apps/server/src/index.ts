import {MyServer,Connection} from './core'
import {Api, ApiEnum} from './common'

const server = new MyServer({ port: 9988 })

server.setApi(ApiEnum.Test, (connection: Connection, data: Api[ApiEnum.Test]['req']): Api[ApiEnum.Test]['res'] => {
    return { data:"bbb" }
})

server.start();