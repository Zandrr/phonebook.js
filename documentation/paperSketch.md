Sketch of Paper No. 1
=====================

Problem Statement
-----------------

Anonymous asynchronous transfer of information, particularly large files, is currently quite difficult.

Services that currently do something like what we want to do:
-------------------------------------------------------------
  - GNUnet
  - Freenet
  - Tor
  - i2p
  - BitTorrent sync and/or trackerless torrents

Ideas we like
-------------
  - 3rd generation onion routing
  - virtual private storage with operators' identities safeguarded with OAUTH
  - encryption of all data before it enters the network
  - randomized load balancing and some sort of on-demand load balancing
  - Byzantine fault and failure resistance
  - making something that even people with little technical know-how can set up (but not pandering to them -- provide technical specs and make it possible for people to contribute to the back end by hosting everything on Github)
  - p2p network for asynchronous data storage
  - information-centric networking
  - distributed fast data storage via a DHT (specifically, Bamboo / OpenDHT)
  - phantom.js script for "checkups" on all nodes in our data-storage table

Sketch of our solution
----------------------
We want an asynchronous p2p network based in the cloud. Ideally, instances would be located in different layer 2 networks / ASes (begs the question: what is happening with the migration of Tor volunteer contribs to the cloud?). Each user of our service must contribute a node in order to obtain the 'public' list of all nodes in the table, which allows for using the service. One must know where the nodes are in order to add data to them. We want to protect user data and user identities by using third-generation onion routing between the user's machine and their data's resting place in the DHT. We want to use OAUTH to coordinate user identities and credentials, and make it possible for this service to be administered asynchronously as well: each user is RESPONSIBLE for pulling down the latest node version (based on our simple instructions). Each user keeps control over their credentials and does not share them. Key sharing for encryption and decryption of data on entry/exit from the DHT may also be organized via OAUTH. We want data to be available within reasonable time, but ONLY to those who are on that particular datum's destination list. We want to take advantage of modern technology and not reinvent the wheel, hence using OAUTH, Bamboo, and nodejs. We want to make this service simple to use, contribute to (either by running a node or adding to the codebase by submitting a pull request), and administer. We want to not have to do a lot of work to keep the DHT going, nor should users have to do a lot of work to keep their nodes going. We want NO credentials to at ANY TIME be shared or distributed (unless we decide on having people who keep lists of credentials, but this seems as if it would be unhelpful at present). 
