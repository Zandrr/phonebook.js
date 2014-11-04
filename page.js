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

    var User = db.define("user", {
        id: {type: "text", required: true, mapsTo: "source_id"},
//        uploads: {type: "object", values: {}, required: true},
//        downloads: {type: "object", values: {}, required: true},
        source: {type: "boolean", defaultValue: false},

        {
            methods: {},
            validations: {}
        }
    });

    /* relations between one User and their list of uploads/downloads. Each file (up/down) is represented by one Record */
    User.hasMany("uploads", Record, {reverse: "user", autoFetch: true, mergeTable: "uploads"});
    User.hasMany("downloads", Record, {reverse: "user", autoFetch: true, mergeTable: "downloads"});

    /* initial model for associating the hash of a file with its source, destination, and rendezvous location */
    var Record = db.define("record", {
        source_id: {type: "text", required: true, unique: true, mapsTo: "id"},
        dest_id: {type: "text", required: true, defaultValue: null},
        file_size: {type: "number", required: true},
        file_location: {type: "text"}, //.onion address, added once the file is requested
        sha512hash: {type: "text", required: true, unique: true},
        ttl: {type: "integer", required: true},
        timestamp: {type: "date", time: true},

        {
            methods: {
            //possible errors:
            //    ReportIncorrectHash: the hash did not match any of the hashes available from source requestedSource for dest requestedDest
            //    ReportIncorrectDestination: requestedDest did not match any possible destination listed by requestedSource
            //    ReportIncorrectSource: the hash and the destination exist, but the file is not available from source requestedSource
            //    ReportExpiredTTL: the TTL has been decremented to zero by previous download(s) of the file and thus has expired
            //    ReportIncorrectLocation: internally, the phonebook can't put file x in location y for some reason. Might take this out.
            //    ReportHashCollision: this should hopefully be quite rare

                isInfinite: function() {if (this.ttl == Number.POSITIVE_INFINITY) return true; else return false;},

                /* debug purposes */
                getFullRecord: function(requestedHash, requestedSource, requestedDest, requestedLoc) {
                        if (requestedHash != this.sha512hash) {
                            return {error: 'ReportIncorrectHash', sha512hash: requestedHash, dest_id: requestedDest};
                        }

                        if (requestedDest != this.dest_id) {
                            return {error: 'ReportIncorrectDestination', sha512hash: requestedHash, dest_id: requestedDest};
                        }

                        if (this.source_id != requestedSource) {
                            return {error: 'ReportIncorrectSource', sha512hash: requestedHash, source_id: requestedSource};
                        }

                        if ((this.ttl > 0) && (this.ttl != Number.POSITIVE_INFINITY)) {
                            this.ttl = this.ttl - 1;
                            this.ttl.save();
                        }

                        if (this.ttl <= 0) {
                            if (this.sha512hash) this.remove();

                            return {error: 'ReportExpiredTTL', sha512hash: requestedHash, dest_id: requestedDest};
                        }

                        return {sha512hash: this.sha512hash, dest_id: this.dest_id, loc: this.file_location, size: this.file_size, ttl: this.ttl};
                },

                /* debug purposes */
                hasLocation: function(requestedHash, requestedSource, requestedDest, requestedLoc) {
                    if (this.sha512hash == requestedHash) {
                        if (this.file_location != requestedLoc) {
                            return {error: 'ReportIncorrectLocation', sha512hash: requestedHash, file_location: requestedLoc};
                        }

                       if (this.dest_id != requestedDest) {
                            return {error: 'ReportIncorrectDestination', sha512hash: requestedHash, dest_id: requestedDest};
                       }

                       return {sha512hash: requestedHash, source_id: requestedSource, dest_id: requestedDest, loc: requestedLoc};
                    }

                    return {error: 'ReportIncorrectHash', sha512hash: requestedHash, dest_id: requestedDest};
            },

            /* once a random rendezvous point is acquired from the list, associate it to our record */
            assignLocation: function(requestedHash, requestedSource, requestedDest, newLocation) {
                if (this.sha512hash == requestedHash) {
                    if (this.file_location) {
                        return {error: 'ReportLocationAlreadyAssigned', sha512hash: requestedHash, source_id: requestedSource, dest_id: requestedDest};
                    }

                    if (this.dest_id != requestedDest) {
                         return {error: 'ReportIncorrectDestination', sha512hash: requestedHash, dest_id: requestedDest};
                    }

                    if (this.source_id != requestedSource) {
                        return {error: 'ReportIncorrectSource', sha512hash: requestedHash, source_id: requestedSource};
                    }

                    this.file_location = newLocation;
                    this.file_location.save();

                    return {sha512hash: requestedHash, source_id: requestedSource, dest_id: requestedDest, file_location: newLocation};
                }

                return {error: 'ReportIncorrectHash', sha512hash: requestedHash, dest_id: requestedDest};
            },

            validations : {
                ttl: orm.enforce.ranges(1, Number.POSITIVE_INFINITY, 'ReportExpiredTTL'),
                sha512hash: orm.enforce.unique({scope: ['sha512hash']}, 'ReportHashCollision')
            }
        }
    });

    Record.findByHash({hash: requestedHash}, function(err, items){


    });

    Record.findBySource({source_id: requestedSource}, function(err, items){


    });

    Record.findByDest({dest_id: requestedFrom}, function(err, items){


    });

});

/* allow searching by source */

/* allow searching by destination */

/* allow searching by full SHA 512 hash for now (later we'll possibly add a choice of hash functions)  */


