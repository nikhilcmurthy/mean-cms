module.exports = function(User) {
  User.settings.ttl = 3600 * 1000 * 24;
};
