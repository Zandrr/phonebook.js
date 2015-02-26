Initial Restrictions
====================

- an updated list of 'up' nodes and delays must be available to each node
- circuit statuses would disrupt forward secrecy (each circuit must be constructed from A to B without
anyone in the middle reporting to either endpoint unless directly connected to that endpoint with no other
nodes in between)
- joining the network should be immediate, but consensus that a node is a ``good" node should only happen after the checker has hit the node several times to ensure nothing untoward is happening (e.g. you can join and send, but nothing can be routed through you until the checker approves)

----------

Note that this is merely our use case for forwarded authentication setup and whatever that evolves into, but
likely useful in its own right.

I'm documenting changes I have made to the canonical Bamboo code here such that they can be recorded in our paper
if deemed necessary. This is also so I can break up the amorphous (and slightly ominous)
task of "yeah make Bamboo secure" into smaller more reasonable chunks.


Changelog
=========

- add capability to encrypt communication between Bamboo nodes using AES + RSA as defined in
http://www.dmi.unict.it/diraimondo/web/wp-content/uploads/papers/fsor-journal.pdf aka forward secure onion routing
- add capability to interface with a Bamboo node that the user "owns" to the client
- add a list of all current nodes to each node instance
- finish implementing 3rd gen onion routing over the table and audit (e.g. no hop knows more than the previous hop and the
next destination, and we're sure this works pretty decently before unleashing it on the unsuspecting)
- make circuit length randomized with a minimum of 3 hops and a maximum dependent on the timeout length and the
current size of the db

