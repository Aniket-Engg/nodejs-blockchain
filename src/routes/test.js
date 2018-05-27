function testAPI(req, res, next){
    console.log("Test Successful!");
    res.status(200).send({"message":"Success"});
}

function testpostAPI(req, res, next){
    console.log("TestPost Successful!");
    if (req.body.age>20)
      res.status(200).send({"name":req.body.name, "age":req.body.age});
    else
      res.status(404).send({"error":"Error in Access"});
}


module.exports = function (router) {
    
      router.get('/test',
        (req, res, next) => {
          next();
        },
        testAPI
      );

      router.post('/testpost',
      (req, res, next) => {
        next();
      },
      testpostAPI
    ); 
}