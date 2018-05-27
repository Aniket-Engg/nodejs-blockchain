import WebSocket from 'ws';
const {p2p_port, sockets} = require('../config');
const logger = require('../utils/logger').logger;

export var write = (ws, message) => 
{
    if(message.hasOwnProperty('data')){
        var temp = JSON.parse(message.data);
        if(temp.length == 1)
            delete temp[0]['extraData'];
        else{
            for(var i=1;i<temp.length;i++)
                delete temp[i]['extraData'];
        }        
        message.data = JSON.stringify(temp);
    }
    ws.send(JSON.stringify(message));   
}

export var broadcast = (message) => {
    sockets.forEach(socket => write(socket, message));
}