
import express from 'express';
import osprey from 'osprey' // the RAML api engine
import bodyParser from 'body-parser';
import storage from 'node-persist';
import {initPeerToPeerServer, connectToPeers} from './src/init';
const config = require('./src/config');
const blockservice = require('./src/services/block');
const logger = require('./src/utils/logger').logger;

var ramlFile = config.ramlPath; // RAML file path
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const ramlConfig = {
  "server": {
    "notFoundHandler": false
  },
  "disableErrorInterception": true
};
//connectToPeers(initialPeers);
initServer();
initPeerToPeerServer();

function initServer() {
  osprey.loadFile(ramlFile, ramlConfig)
    .then(function (middleware) {

      //Instantiate the app.
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: true
      }));

      var router = osprey.Router();

      // set up all the routes found in the routes directory
      var routes = require('./src/routes')(router);

      // Mount the RAML middleware at our base /api/v1
      app.use(config.apiSuffix, middleware, routes);
      storage.init({dir: 'src/storage/blocks'}, function (err, value) {
        if(err)
            {
                logger.error(err);
            }
        logger.info("Storage",value);
      });
     
      // blockservice.addGenesisBlock();
      var server = app.listen((process.env.PORT || config.port), () => {
        logger.info(`Server running at http://localhost:${server.address().port}${config.apiSuffix}`);
      });

    })
    .catch(function (e) {
      logger.error("Error: %s", e.message);
      process.exit(1)
    });
}

