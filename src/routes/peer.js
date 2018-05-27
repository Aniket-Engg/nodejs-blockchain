import{connectToPeers} from '../services/peer';
const {p2p_port, sockets} = require('../config');
const logger = require('../utils/logger').logger;

var addPeer = (req, res, next) =>{
  connectToPeers([req.body.peer]);
  res.json({"message" : "Peer Adding Request Processed"});
}

var getPeers = (req, res, next) =>{
  res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
}


module.exports = function (router) {    
    router.post('/addpeer',
    (req, res, next) => {
      next();
    },
    addPeer
  );

    router.get('/peers', 
    (req, res, next) => {
      next();
    },
    getPeers
  );
}