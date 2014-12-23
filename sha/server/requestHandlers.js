var querystring = require('querystring'),
    fs          = require('fs'),
    formidable  = require('formidable'),
    pgp         = require('openpgp'),
    sha         = require('../../node_modules/openpgp/src/crypto/hash/sha.js');

function start(response){
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
    var file = ""; //name to be written back for the response

    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files){
       //debugging output
       console.log(JSON.stringify(fields, null, 4) + '\n' + JSON.stringify(files.upload, null, 4));

        //this is going to need to change (we need a filename variable)
        if (err) {
            fs.unlink("./tmp/test.txt");
            fs.rename(files.upload.path, "./tmp/test.txt");
        }

        if (!fields.destination) {
            console.log("Destination field was null. Encrypting with no set destination.");
        }

        var key = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';

        if (!fields.username) {
            //generate a fresh keypair on the spot instead of having the user upload one.
            key = pgp.generateKeyPair({numBits: 4096, userId: 'user', passphrase: fields.keyword});
        }

        fields.username = pgp.key.readArmored(key);
        fields.userhash = sha.sha512(fields.username);

        file = fields.userhash; //just for debug for now so we can print something
        console.log("\nHASH: "+file);

        //file variable name
        fs.readFile("./tmp/test.txt", 'utf8', function(err, data){
            pgp.encryptMessage(key.keys, data).then(function(encrypted){
                var hash = sha.sha512(encrypted);
                fs.writeFile("./tmp/test.txt", username+', '+userhash+'\n'+encrypted+', '+hash+'\n');
            }).catch(function(error){
                console.log("Encryption of your file has failed.");
                throw(error);
            });
        });

    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image! "+file+"<br>"); //this should change
    response.write('"<p> /show </p>"');
    response.end();
}

function show(response){
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream("./tmp/test.txt").pipe(response);
}

exports.start   = start;
exports.upload  = upload;
exports.show    = show;
