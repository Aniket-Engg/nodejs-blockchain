import{getAll, addBlock, generateNextBlock} from '../services/block';
import{broadcast} from '../socket';
import{responseLatestMsg} from '../init';
const logger = require('../utils/logger').logger;

var getBlockchain = (req, res, next) =>{
  res.send(getAll());
}

var mineBlock = (req, res, next) => {
  var newBlock = generateNextBlock(req.body.data, req.body.extraData);
  broadcast(responseLatestMsg());
  addBlock(newBlock).then(function(result){    
    res.status(200).json({"message" : "Block Added Successfully"});
  }).catch(function(err){
    res.status(500).json({"error" : "Error In Adding Block"});
  });    
}

module.exports = function (router) {    
      router.get('/blocks',
      (req, res, next) => {
        next();
      },
      getBlockchain
    );

    router.post('/mine',
    (req, res, next) => {
      next();
    },
    mineBlock
  );
}