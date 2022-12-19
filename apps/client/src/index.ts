import {WebSocket} from 'ws'
import {ApiMsgEnum} from './common'

const ws = new WebSocket('ws://localhost:9988')

ws.on('open', () => {
        ws.send(JSON.stringify({"name":ApiMsgEnum.Test,"data":["a","b"]}))
    })

ws.on('message', (data) => {
    console.log(data);
    console.log('received: %s', data);
})
