import {WebSocket} from 'ws'
import {Api, ApiEnum} from './common'

const ws = new WebSocket('ws://localhost:9988')

ws.on('open', () => {
        var api:ApiEnum = ApiEnum.Test
        // const data:Api[typeof api]['req'] = {id:1,nickname:"娃哈哈"}
        const data = {id:1,nickname:"娃哈哈"}
        ws.send(JSON.stringify({"name":api,"data": <Api[typeof api]['req']>data}))

        api = ApiEnum.PlayerJoin
        const bb = {uid:'8888',username:"username222"}
        ws.send(JSON.stringify({"name":api,"data": <Api[typeof api]['req']>bb}))
    })

ws.on('message', (data) => {
    console.log(data);
    console.log('received: %s', data);
})
