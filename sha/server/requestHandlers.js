var querystring = require('querystring'),
    fs          = require('fs'),
    crypto      = require('crypto-js'),
    formidable  = require('formidable'),
    pgp         = require('openpgp');

function start(response){
  console.log("Starting response!");
    fs.readFile('../client/form.html', function(err, html){
        if (err){
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();

    });
}

function upload(response, request){
    console.log("Beginning upload...");

    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files){
       console.log(JSON.stringify(fields, null, 4) + '\n' + JSON.stringify(files.upload, null, 4));
        //this is going to need to change (we need a filename variable)
        if (err) {
            fs.unlink("./tmp/test.txt");
            fs.rename(files.upload.path, "./tmp/test.txt");
        }

        if (!fields.destination) {
            console.log("Destination field was null. Encrypting with no set destination.");
        }

        var keypair = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';

        if (fields.username) {
            fields.userhash = crypto.SHA3(fields.username);
            fields.username = pgp.key.readArmored(keypair);
        }else {
            //user doesn't have a key pair yet, so create a new one.
            keypair = pgp.generateKeyPair({numBits: 4096, userId: 'user', passphrase: fields.keyword});
            var username = keypair.publicKeyArmored;

            fields.username = username;
            fields.userhash = crypto.SHA3(username);
            console.log('Please keep your fresh keypair, consisting of a private key (used to decrypt files, should be known only to *you*) and your public key (used to send) in a safe and appropriate location (on a usb stick works).\n BE AWARE YOUR KEYS WILL NOT BE STORED BY THIS APPLICATION!!\n Private key: '+keypair.privateKeyArmored+';\n Public key: '+keypair.publicKeyArmored);

            fields.userhash = userhash;
        }

        //file variable name
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
    response.write("received image:<br/>"); //this should change
    response.write('"<p> /show </p>"');
    response.end();
}

function show(response){
  console.log("Responding!");
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream("./tmp/test.txt").pipe(response);
}

exports.start   = start;
exports.upload  = upload;
exports.show    = show;
