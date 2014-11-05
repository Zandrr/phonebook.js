//A single server "page" node that stores information about encrypted files and encrypted info about their origin/destination.
//These pages are chained together in a distributed key,value store to comprise the "phonebook".
//The idea of a phonebook is based on Pastry's PAST distributed storage table and also Kademlia.
//However, we employ the onion protocol, in the most general sense, for getting things from A to B within our DHT.
//We use trackerless torrents (that must be initiated by the file sender or receiver) to import and export files.

//last updated November 2014
//kaoudis@colorado.edu

var orm = require('orm'); //modifying this later is likely
var fs = require('fs');
var jb = require('json-buffer');
var tls = require('tls');

orm.connect("sqlite://username:password@hostname?debug=false&strdates=true/phonebook", function(err, db){
    if (err) throw err; // return over tls connection?

    db.load("./models");
    var User = db.models.User;
    var Record = db.models.Record;

    /* relations between one User and their list of uploads/downloads. Each file (up/down) is represented by one Record */
    User.hasMany("uploads", Record, {reverse: "user", autoFetch: true, mergeTable: "uploads"});
    User.hasMany("downloads", Record, {reverse: "user", autoFetch: true, mergeTable: "downloads"});

    /* some functions for working with User items */
    User.userAlreadyExists: function(requestedUserId) {
        if exists({id: 1, user_id: requestedUserId}) return true;
        else return false;
    };

    User.addUser: function(requestedUserId, source) {
        if !User.userAlreadyExists(requestedUserId) {
            var newUser = {};
            newUser.user_id = requestedUserId;
            newUser.source = source;
            User.create(newUser, function(err, results) {
                if (err) return err;

                return {}; //network statistics
            });
        }

        else return {error: 'ReportUserExists', user_id: requestedUserId, source: source};

    }

});


