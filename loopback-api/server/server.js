/*
* module dependencies
* */
const loopback = require('loopback');
const boot = require('loopback-boot');
const debug = require('debug')('cms:loopback-api:server');
const colors = require('colors/safe');
const path = require('path');
const http = require('http');

/*
* create a loopback application instance
* */
const app = module.exports = loopback();

/*
* bootstrap loopback application
* */
boot(app, __dirname);

/*
* register express middleware with application instance
* using loopback app.middleware API to register built-in middleware
* */
app.middleware('initial:before', loopback.favicon());
app.middleware('initial', loopback.compress());
app.middleware('session', loopback.session({
  secret: app.settings.secret,
  saveUninitialized: true,
  resave: true,
  rolling: true,
  cookie: {maxAge: (1000 * 60 * 10)}
}));
app.middleware('auth', loopback.token({
  model: app.models.accessToken
}));
app.middleware('parse', loopback.json());
app.middleware('parse', loopback.urlencoded({extended: true}));
app.middleware('final', loopback.urlNotFound());
app.middleware('final:after', loopback.errorHandler());

/*
* create a http server instance, setup port and start the server
* optionally can be used to configure https server
* */
app.start = function () {

  const server = http.createServer(app);

  // set configured PORT number ONLY in development / build environment
  // in production, host system will set the value
  if (app.settings.env === 'development' || app.settings.env === 'build') {
    process.env.PORT = app.settings.port;
  }

  server.listen(process.env.PORT, function () {
    const baseURL = `http://${app.get('host')}:${process.env.PORT}`;
    app.emit('started', baseURL);
    debug(colors.green('Server listening : %s/'), baseURL);
    debug(colors.cyan('Node Environment : %s'), app.settings.env);
    debug(colors.gray('Current Server Time in GMT: %s'), (new Date()).toUTCString());
  });
};

app.start();
