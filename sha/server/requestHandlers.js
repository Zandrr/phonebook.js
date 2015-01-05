var querystring = require('querystring'),
    fs          = require('fs'),
    formidable  = require('formidable'),
    pgp         = require('openpgp'),
    sha         = require('../../node_modules/openpgp/src/crypto/hash/sha.js');

var DEBUG = 1;

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
        //this is going to need to change (we need a filename variable)
        if (err) {
            fs.unlink("./tmp/test.txt");
            fs.rename(files.upload.path, "./tmp/test.txt");
        }

        if (!fields.destinationKeyList) {
            console.log("Encrypting file with no set destination(s).");
        }

        var key = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';

        if (!fields.pk) {
            //generate a fresh keypair on the spot instead of having the user upload one.

            if (DEBUG) {
                if (!fields.passphrase) console.log("Creating keypair without passphrase, FOR DEBUG ONLY");

                fields.pk = "generating new keypair...";
                console.log("Public key? "+fields.pk);
                if (fields.destinationKeyList) console.log('Destination: '+fields.destinationKeyList);
                console.log('Data synopsis: \n'+JSON.stringify(files.upload, null, 4));
            }

            if (fields.keyword) {
                key = pgp.generateKeyPair({numBits: 4096, userId: 'user', passphrase: fields.keyword});
            }else {
                key = pgp.generateKeyPair({numBits: 4096, userId: 'user'});
            }

            if (key) {
                console.log('New keypair successfully generated!');
            }

        }

        fields.pk = pgp.key.readArmored(key);
        fields.pkhash = sha.sha512(pgp.key.readArmored(key)); //user-id (temp for now -- shorten?)
        console.log("Public: "+fields.pk.publicKeyArmored+"\n");
        console.log("Private: "+fields.pk.privateKeyArmored+"\n");

        file = fields.pkhash; //debug
        console.log("\nHASH: "+file);

        //file variable name!!!!!
        fs.readFile("./tmp/test.txt", 'utf8', function(err, data){
                if (err) {
                    return console.log(err);
                }

                var ciphertext = pgp.encryptMessage(fields.pk.keys, data);
                if (ciphertext) {
                var hash = sha.sha512(ciphertext);
                fs.writeFile("./tmp/test.txt", fields.pk.keys+', '+fields.pkhash+'\n'+ciphertext+', '+hash+'\n');
            } else {
                console.log("Encryption of your data failed. Ending transaction.");
            }
        });

    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<strong>Encrypting...</strong> "+file+"<br>"); //this should change
    response.write('"<p> /show </p>"');
    response.end();
}

function show(response){
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream("./tmp/test.txt").pipe(response);
}

function download(pkB, pkA, file) {


}

exports.start    = start;
exports.upload   = upload;
exports.show     = show;
exports.download = download;
