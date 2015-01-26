var express         = require('express'),
    http            = require('http'),
    routes          = require('./routes'),
    bodyParser      = require('body-parser'),
    fs              = require('fs');

fs.realpath(__dirname + '/../', function (err, projectRoot) {
  var app = express();
  console.log(projectRoot);

  /* Set Up */
  app.set('port', process.env.PORT || 5000);
  app.set('views', projectRoot + '/server/views');
  app.set('view engine', 'jade');
  app.use(require('serve-static')(projectRoot + '/client/partials'));
  app.use(require('serve-static')(projectRoot + '/client/src'));
  app.use(require('serve-static')(projectRoot + '/client/assets'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var server = http.createServer(app);
  routes(app); //seperate routes from main server

  server.listen(app.get('port'), function(){
    console.log("listening on port "+ app.get('port'));
  });


});