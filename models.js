var orm = require('orm');

module.exports = function(db, callback) {
    var User = db.define("user", {
        user_id: {type: "text", required: true, mapsTo: "source_id"},
        uploads: {type: "object", values: {}, required: true},
        downloads: {type: "object", values: {}, required: true},
        source: {type: "boolean", defaultValue: false},

        {
            methods: {
                userAlreadyExists: function(requestedUserId) {
                    if this.exists({id: 1}) return true;
                    else return false;
                },

                isSource: function() {
                    if (this.source == true) return true;
                    else return false;
                },

                hasActiveUploads: function() {
                    if (this.isSource() && (Object.keys(this.uploads).length >= 1) ) return true;
                    else return false;
                },

                hasActiveDownloads: function() {
                    if ((!this.isSource()) && (Object.keys(this.downloads).length >= 1)) return true;
                    else return false;
                },

             },

            validations: {
                user_id: orm.enforce.unique({scope: ['user_id']}, 'ReportIdentifierCollision')

            }
       }
    });

/* associating the hash of a file with its source, destination, and (eventual) rendezvous location */
    var Record = db.define("record", {
        source_id: {type: "text", required: true, unique: true, mapsTo: "user_id"},
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
};
