import WebSocket from 'ws';
import {initConnection} from '../../init';
const {p2p_port, sockets} = require('../../config');
const logger = require('../../utils/logger').logger;

export var connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        var ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            logger.error('connection failed');
        });
    });
};             