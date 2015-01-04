//create a (simple) single-node instance.
//last updated January 2015

function page(name, uri) {
    this.name = name; //nick of this database
    this.uri = uri;
    this.tagMap = new WeakMap(); //map full Tags to lists of chunk positions

    this.tagQuery = function(tag) {
        if (this.tagMap.has(tag)) return this.tagMap.get(tag);
    }

    //check to ensure each chunk added to the DB for temporary storage
    //doesn't match the Tag on any currently existing chunk
    this.consolidateTags = function(tag, chunk) {
        if (this.tagMap.has(tag)) {
            updatedChunklist = null;
            updatedChunklist = this.tagMap.get(tag);
            updatedChunklist.add(chunk);
            this.tagMap.set(tag, updatedChunklist);

            return true;
        }else return false;
    }

    //get sequence number of chunk
    this.whichPart = function() {


    }

    //are we the initial destination? pass the object on
    //otherwise, store it in the next (random) open slot
    this.putTaggedChunk = function() {

    }

    this.deleteTag = function() {


    }


    //Floodfill helper
    this.getTag = function() {

    }


    this.getNeighbour = function() {


    }

    this.nope = function() {


    }

    this.onSuccess = function() {


    }
}


