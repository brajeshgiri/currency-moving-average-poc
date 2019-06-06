
import { STOCK_WEB_SOCKET_URI } from './uriConstants';

export default (onOpen, onMessage) => {
    const ws = new WebSocket(STOCK_WEB_SOCKET_URI);

    ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
        onOpen(ws);
    }

    ws.onmessage = evt => {
        // on receiving a message, add it to the list of messages
        const message = JSON.parse(evt.data)
        onMessage(message);
    }

    ws.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
        // ws = new WebSocket(URL),
    }

}