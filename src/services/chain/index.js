import storage from 'node-persist';
import{broadcast} from '../../socket';
import {getLatestBlock, getFirstBlock, add} from '../../storage/services';
import {queryAllMsg, responseLatestMsg} from '../../init';
import {calculateHashForBlock, isValidNewBlock} from '../block';
const logger = require('../../utils/logger').logger;
const foreach = require('foreach');


export var handleBlockchainResponse = (message) => {
    
    var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index > b2.index));
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];    
    var latestBlockHeld = getLatestBlock();    
    if (latestBlockReceived.index > latestBlockHeld.index) {
        logger.info('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            if(calculateHashForBlock(latestBlockReceived)===latestBlockReceived.hash) {
                logger.info("We can append the received block to our chain");
                add(latestBlockReceived).then(function(result){
                    broadcast(responseLatestMsg());
                }).catch(function(err){
                    logger.error(err);
                    reject(err);
                });                
            }
            else
                logger.info("Block Hash Mismatch, can not be added");
        } else if (receivedBlocks.length === 1) {
            logger.info("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        } else {
            logger.info("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlocks);
        }
    } else {
        logger.info('received blockchain is not longer than existing blockchain. Do nothing');
    }
};

var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > storage.length()) {
        logger.info('Received blockchain is valid. Replacing current blockchain with received blockchain');
        foreach(newBlocks, function (value, key){
            add(value).then(function(result){    
                logger.info("Block at"+key+" replaced"); 
                if(key==newBlocks.length-1)
                    broadcast(responseLatestMsg());
            }).catch(function(err){
                logger.error("Error while replacing the chain "+err);
            });
        });
    } else {
        logger.info('Received blockchain invalid');
    }
};

var isValidChain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getFirstBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};