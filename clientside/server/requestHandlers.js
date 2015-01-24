var querystring = require('querystring'),
    fs          = require('fs'),
    formidable  = require('formidable'),
    pgp         = require('openpgp'),
    sha         = require('../../node_modules/openpgp/src/crypto/hash/sha.js');

var DEBUG = 1;
var FILENAME = "";

function respond(response, html) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
}

function start(response){
    fs.readFile('../client/home.html', function(err, html){
        if (err){
            throw err;
        }

        respond(response, html);
    });
}

function minCSS(response) {
    fs.readFile('../client/assets/bootstrap.min.css', function(err, html) {
        if (err) {
            throw(err);
        }

        respond(response, html);
    });
}

function minJS(response) {
    fs.readFile('../client/assets/bootstrap.min.js', function(err, html) {
        if (err) {
            throw(err);
        }

        respond(response, html);
    });
}

function jquery(response) {
    fs.readFile('../client/assets/jquery.js', function(err, html) {
        if (err) {
            throw(err);
        }

        respond(response, html);
    });
}

function mainCSS(response) {
    fs.readFile('../client/assets/main.css', function(err, html) {
        if (err) {
            throw(err);
        }

        respond(response, html);
    });
}

function bootstrap(response) {
    fs.readFile('../client/assets/bootstrap.css', function(err, html) {
        if (err) {
            throw(err);
        }

        respond(response, html);
    });
}

function upload(response, request){
    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files){
    //need to handle files that don't exist somehow (throwing an ENOENT is hardly helpful)


        if (err) {
            fs.unlink(files.upload.path);
            throw(err);
        }

        FILENAME = files.upload.path;

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

            //not sure if we need userid, possibly ask Matt or JB regarding PGP's simplest setup

            if (fields.keyword) {
                key = pgp.generateKeyPair({numBits: 4096, userId: fields.user, passphrase: fields.keyword});
            }else {
                key = pgp.generateKeyPair({numBits: 4096, userId: fields.user});
            }

            if (key) {
                console.log('New keypair successfully generated!');
            }else throw(key);

        }

        fields.pk = pgp.key.readArmored(key);
        fields.pkhash = sha.sha512(pgp.key.readArmored(key)); //user-id (temp for now -- shorten?)

        fs.readFile(FILENAME, 'utf8', function(err, data){
                if (err) {
                    return console.log(err);
                }

                var priv = pgp.key.readArmored(key).keys[0];
                var ciphertext = pgp.signAndEncryptMessage(fields.pk, priv, data);

                if (ciphertext) {
                    var hash = sha.sha512(ciphertext);
                    fs.writeFile(FILENAME, fields.pk.keys+', '+fields.pkhash+'\n'+ciphertext+', '+hash+'\n');
                } else {
                    console.log("Encryption of your data failed. Ending transaction.");
                }
        });

    });

    //go to next screen
    fs.readFile('../client/upload.html', function(err, html){
        if (err) {
            throw(err);
        }

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
        show(response);
    });
}

function show(response){
  response.writeHead(200, {"Content-Type": "text/plain"});
  fs.createReadStream(FILENAME).pipe(response);
}

exports.start     = start;
exports.upload    = upload;
exports.show      = show;
exports.minCSS    = minCSS;
exports.minJS     = minJS;
exports.jquery    = jquery;
exports.mainCSS   = mainCSS;
exports.bootstrap = bootstrap;

