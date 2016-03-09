module.exports = function (server) {

   var router = server.loopback.Router();

   server.use('/authenticate', router);

   router.get('/', function(req, res) {
      console.log('authenticate request received...');
   });

   router.get('/success', function (req, res) {
      res.send({ token : 'test-token'});
   });

   router.get('/failure', function(req, res) {
      res.sendStatus(401);
   });
};
