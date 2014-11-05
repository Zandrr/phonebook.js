var querystring = require("querystring"),
    fs          = require('fs'),
    crypto      = require('crypto'),
    formidable = require("formidable");
function start(response){
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload File" />'+
    '</form>'+
    '</body>'+
    '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

}

function upload(response, request){
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  var shasum = crypto.createHash('sha1');

  console.log("about to parse");
  form.parse(request, function(err, fields, files){
    if (err) {
      fs.unlink("./tmp/test.txt");
      fs.rename(files.upload.path, "./tmp/test.txt")
    }
  });
 fs.readFile("./tmp/test.txt", 'utf8', function(err,data){
    fs.writeFile("./tmp/test.txt", data+'\n'+shasum.update(data).digest('hex'));
  });




  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("received image:<br/>");
  response.write("'/show'");
  response.end()
}

function show(response){
  console.log("request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream("./tmp/test.txt").pipe(response);
}



exports.start   = start;
exports.upload  = upload;
exports.show    = show