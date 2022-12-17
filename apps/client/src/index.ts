import {WebSocket} from 'ws'

const ws = new WebSocket('ws://localhost:8899')

ws.on('open', () => {
        ws.send('something')
    })

ws.on('message', (data) => {
    console.log(data);
    console.log('received: %s', data);
})
