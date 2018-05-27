import CryptoJS from 'crypto-js';
import {add, getLatestBlock, getAllBlocks} from '../../storage/services';
const logger = require('../../utils/logger').logger;

export var addBlock = (block) =>{
    return new Promise(function (resolve, reject){
        if (isValidNewBlock(block, getLatestBlock())){
            add(block).then(function(result){    
                resolve(true);               
            }).catch(function(err){
                logger.error(err);
                reject(err);
            });      
        }
    });
}

export var addGenesisBlock = () => {
    add(formBlock(0, "0", 1465154705, "Genesis block!!","Genesis ExtraData", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7"));
}

export var getAll = () => {
    return getAllBlocks();
}

export var generateNextBlock = (blockData, extraData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return formBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, extraData, nextHash);
};

var formBlock = (index, previousHash, timestamp, data, extraData, hash) => { 
        var block = {};
        block.index = index;
        block.previousHash = previousHash;
        block.timestamp = timestamp;
        block.data = data;
        block.extraData = extraData;
        block.hash = hash;
        
        return block;
}

var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};


var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

export var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        logger.error('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        logger.error('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        logger.info(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        logger.error('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};



