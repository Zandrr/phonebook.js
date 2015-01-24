var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle          = {};

//html content
handle["/"]         = requestHandlers.start;
handle["/start"]    = requestHandlers.start;
handle["/upload"]   = requestHandlers.upload;
handle["/show"]     = requestHandlers.show;
handle["/download"] = requestHandlers.download;

//styling & fonts
handle["/assets/bootstrap.css"] = requestHandlers.bootstrap;
handle["/assets/main.css"] = requestHandlers.mainCSS;
handle["/assets/jquery.js"] = requestHandlers.jquery;
handle["/assets/bootstrap.min.css"] = requestHandlers.minCSS;
handle["/assets/bootstrap.min.js"] = requestHandlers.minJS;
handle["/fonts/Chunkfive-webfont.woff"] = requestHandlers.woff;
handle["/fonts/Chunkfive-webfont.ttf"] = requestHandlers.ttf;

server.start(router.route, handle);
