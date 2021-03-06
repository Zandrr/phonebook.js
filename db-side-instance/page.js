//create a (simple) single-node instance.
//last updated January 2015

//list of Tags is mapped to individual lists of Chunks via a WeakMap (not iterable, but indexable like a hash table)
//each individual Chunk list is a Set (values must be unique)
//each Chunk is a JSON object consisting of the piece of encrypted data, the sequence number, the Tag (hash of the whole encrypted file), the Chunk's source, and its list of possible destinations

function page(name, uri) {
    this.name = name; //nick of this database
    this.uri = uri;

    this.nodesMap = new Map(); //strongly map node nicks to IPs (we want a list of keys in this case)
    this.neighbour1 = null; //save a randomly selected pair o' pals for quick updates
    this.neighbour2 = null;

    this.sourceMap = new WeakMap(); //map source list to Tags
    this.destMap = new WeakMap(); //map lists of dests to Tags
    this.tagMap = new WeakMap(); //map full Tags to lists of chunk positions

    this.tagQuery = function(tag) {
        if (this.tagMap.has(tag)) return this.tagMap.get(tag);
    }

    //check to ensure each chunk added to the DB for temporary storage
    //doesn't match the Tag on any currently existing chunk (return false)
    //otherwise, add it to the parent Tag (return True)
    this.consolidateTags = function(tag, chunk) {
        chunklist = this.tagQuery(tag);

        if (chunklist) {
            chunklist.add(chunk);
            this.tagMap.set(tag, chunklist);

            return true;
        }else return false;
    }

    //get sequence number of chunk in file
    this.whichPart = function(chunk) {
        return chunk.seqNo;
    }

    //are we the initial destination? pass the object on
    //otherwise, store it in the next (random) open slot
    this.putTaggedChunk = function(sourceID, tag, chunk) {
        if ((this.name != sourceID) && this.nodesMap.has(sourceID)) {
            this.consolidateTags(tag, chunk);
        }else { //send forth
            this.sendToNeighbour(sourceID, tag, chunk);
        }
    }

    //only to be used after chunks have been sent and TTL has expired on tag
    this.deleteTag = function(tag) {
        if (this.tagMap.has(tag)) {
            this.tagMap.delete(tag);
        }
    }

    this.getNeighbour = function() {


    }

    this.sendToNeighbour = function(sourceID, tag, chunk) {

    }

    this.updateNeighbourNodesList = function() {

    }

    this.addSelfToNopes = function() {


    }

    //send a response back to neighbour1 to send back to sourceID
    this.onSuccessfulChunkAdd = function(sourceID, tag, chunk, response) {


    }

    //when the node owner wants to "turn off" this copy of the db
    //we need to spread our data across other nodes.
    this.goOffline = function() {


    }
}


