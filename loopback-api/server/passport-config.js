/*
 * module dependencies
 **/
const PassportConfigurator = require('loopback-component-passport').PassportConfigurator;

/*
 * sets up passport configurator both for local authentication
 **/
function CMSPassportConfig(app) {
   if(!this instanceof CMSPassportConfig) {
      return new CMSPassportConfig(app);
   }
   this.passportConfigurator = new PassportConfigurator(app);
   this.appInstance = app;
}

CMSPassportConfig.prototype.bootstrap = function() {
   var self = this;

   // defaulting to session = true
   self.passportConfigurator.init(false);

   self.passportConfigurator.setupModels({
      userModel: self.appInstance.models.user,
      userIdentityModel: self.appInstance.models.userIdentity,
      userCredentialModel: self.appInstance.models.userCredential,
      roleModel: self.appInstance.models.role,
      roleMappingModel: self.appInstance.models.RoleMapping
   });

   configureProvider();

   function configureProvider() {
      var config = {};
      try {
         config = require('./providers.json');
      } catch (err) {
         console.trace(err);
         process.exit(1); // fatal
      }

      var c = config['local'];
      self.passportConfigurator.configureProvider('local', c);
   }
};

/*
 * export constructor
 **/
export {CMSPassportConfig};
