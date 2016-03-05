module.exports = function(AccessToken) {

   /*
    * search an access token, get associated user id and
    * destroy all access tokens issued to the user. This will
    * log the user out of all application sessions
    **/
   AccessToken.releaseUserToken = function(tokenId, cb) {
      AccessToken.find({
         'where': {
            '_id': tokenId
         },
         'include': 'user'
      }, function(err, token) {
         if(err) {
            cb(err);
         }
         AccessToken.destroyAll({
            'where': {
               'userId' : token.userId
            }
         }, function(err, info) {
            if(err) {
               cb(err);
            }
            cb(null, info);
         });
      })
   };

};
