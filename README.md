# Blockchain with ExtraData

This is a sample Blockchain developed keeping a usecase in mind in which one who appends the latest block can add any kind of extra data to that block and the data will be visible only to that block-appender.

## Getting Started
This project doesn't provide any user interface, you will get only the REST API server.
This is developed using node.js, so make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/Aniket-Engg/nodejs-blockchain
cd nodejs-blockchain
npm install
npm start
```
API Server will be running on [ http://localhost:5000/api/v1
]( http://localhost:5000/api/v1
).

Break this command (ctrl+c) to stop the server

## Debugging


Use  `nodejs-Blockchain/src/logs/blockchainApiServerLogs.log`  to debug

## Documentation

This server provides below APIs :

```
/blocks: To get the list of blocks
/mine: To add a new block
/addpeer: To add peer 
/peers: To get the lost of all peers
```
For more insights, [this](https://medium.com/@aniketengg/blockchain-with-extra-data-using-node-js-641932ba76de) can help.
<br/>Note: This code is not for production-use. 

