import path from 'path';


module.exports = {
    port : 5000,
    p2p_port : 5002,
    ramlPath : path.resolve('./src/raml', 'apiV1.raml'),
    apiSuffix : '/api/v1',
    sockets : []
}