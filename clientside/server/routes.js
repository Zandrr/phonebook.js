var querystring = require('querystring'),
    fs          = require('fs'),
    formidable  = require('formidable'),
    pgp         = require('openpgp'),
    sha         = require('../../node_modules/openpgp/src/crypto/hash/sha.js');

module.exports = function(app){

  var DEBUG = 1;
  var FILENAME = "";

  app.get('/', function(req, res) {
    res.render('index');
  });


  app.post('/upload', function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
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
    res.render('index');
});

  // app.get('/show', function(req,res){
  //   res.writeHead(200, {"Content-Type": "text/plain"});
  //   fs.createReadStream(FILENAME).pipe(res);
  // });
  // function download(pkB, pkA, file) {


  // }

};
