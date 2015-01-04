//create a simple database instance based (for now) on the core
//functionality of Apache's CouchDB. We're not trying to infringe
//on their intellectual property, just to create something entirely
//different that builds on some of the same ideas.

function page(name, uri, headers) {
    this.name = name; //nick of this database
    this.uri = uri;

    this.tagMap = new Map(); //map full Tags to lists of chunk positions

    //do one or more chunks tagged with this Tag exist in this DB node?
    this.tagQuery = function() {


    }

    //check to ensure each chunk added to the DB for temporary storage
    //doesn't match the Tag on any currently existing chunk
    this.consolidateTags = function() {


    }

    //get sequence number of chunk
    this.whichPart = function() {


    }

    //Floodfill
    this.getTag = function() {

    }

    //are we the initial destination? pass the object on
    //otherwise, store it in the next (random) open slot
    this.putTaggedChunk = function() {

    }

    this.deleteTag = function() {


    }
}


