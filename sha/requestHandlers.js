var querystring = require('querystring'),
    fs          = require('fs'),
    crypto      = require('crypto-js'),
    formidable  = require('formidable'),
    pgp         = require('openpgp');


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
    '<input type="field" name="destination">' +
    '<input type="field" name="username">' +
    '<input type="field" name="userhash">' +
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
    console.log("about to parse");

    form.parse(request, function(err, fields, files){
        if (err) {
            fs.unlink("./tmp/test.txt");
            fs.rename(files.upload.path, "./tmp/test.txt");
        }

        if (!fields.destination) {
            console.log("Destination field was null. Encrypting with no set destination.");
        }

        var keypair = null;

        if (fields.username) {
            fields.userhash = crypto.SHA3(fields.username);
            keypair = pgp.key.readArmored(fields.username);
        }else {
            //user doesn't have a key pair yet, so create a new one.
            keypair = pgp.generateKeyPair({numBits: 4096, userId: 'user', passphrase: fields.keyword});
            var username = keypair.publicKeyArmored;

            fields.username = username;
            fields.userhash = crypto.SHA3(username);
            console.log('Please keep your fresh keypair, consisting of a private key (used to decrypt files, should be known only to *you*) and your public key (used to send) in a safe and appropriate location.\n BE AWARE YOUR KEYS WILL NOT BE STORED BY THIS APPLICATION!!\n Private key: '+keypair.privateKeyArmored+';\n Public key: '+keypair.publicKeyArmored);

            fields.userhash = userhash;
        }

        fs.readFile("./tmp/test.txt", 'utf8', function(err, data){
            pgp.encryptMessage(keypair.keys, data).then(function(encrypted){
                var hash = crypto.SHA3(encrypted, {outputLength: 256});
                fs.writeFile("./tmp/test.txt", username+', '+userhash+'\n'+encrypted+', '+hash+'\n');
            }).catch(function(error){
                console.log("Encryption of your file has failed.");
                throw(error);
            });
        });

        keypair = null;
    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("'/show'");
    response.end();
}


function show(response){
  console.log("request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream("./tmp/test.txt").pipe(response);
}

exports.start   = start;
exports.upload  = upload;
exports.show    = show;
