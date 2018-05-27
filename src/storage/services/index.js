import storage from 'node-persist';
const logger = require('../../utils/logger').logger;

export var add = (block) => {
    return new Promise(function (resolve, reject){
        storage.setItem(block.index+'', block, function(err) {
            if(err) {
                    logger.error(err);
                    reject(err);
                }            
            else{
                logger.info("Block with index "+ block.index +" added to storage");
                resolve(true);
            }                
        });
    });
}

export var getLatestBlock = () => {
    return storage.getItemSync(storage.length() - 1);
}

export var getFirstBlock = () => {
    return storage.getItemSync(0);
}

export var getAllBlocks = () => {
    return storage.values();
}