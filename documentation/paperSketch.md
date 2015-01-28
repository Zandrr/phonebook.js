Sketch of Paper No. 1
=====================

What?
----

Tor has some design decisions we are questioning and would like to explore alternatives for.

Particularly:

* no storage on nodes
* allowing people to choose whether or not to be an exit node (allows some parties to take all the blame for abuse)
* no incentive whatsoever to contribute back: classic seeders versus leechers problem (around since the early days of p2p and "private" information sharing)
* if you have a relay or an exit node, unless you basically set up your own ISP, some ISPs such as Comcast can and will throttle the shit out of you once they figure out what is sitting under your dining room table
* while people can contribute to the codebase, how is relay/node/guard software centrally monitored to make sure it conforms and no extra-sneaky stuff is also installed?
* what if we want to send big files without using sketchy upload sites or magnets?! what do? torrenting over tor is a big fat no due to a protocol mismatch at the transport layer: tor hides TCP traffic, but torrenting relies on a UDP tracker to work properly (or you can join a select trackerless torrenting group, but this usually means disclosing some info about yourself in order to join...)
* what about i2p? freenode? they made some better design decisions that we would like to try out in a more torlike environ.

Why do we care?
---------------

In coding and testing to support this exploration, we hope to create a more efficient, user-friendly system for private information sharing and transfer.

What does that even mean? Details.
----------------------------------

It is a pain in the ass to set up hidden services. One of our goals is to create a hidden-service-rendezvous-like (phew!) data sharing mechanism that is compatible with Mac, Windows, and whatever Nixes and other OSes can run modern browsers.

We hope to make this service dependent on *user contributions*, that is, if you do not set up your own node, you do not have the privilege of using the nodes other people have added to the service.

We want to have the software for these nodes (and the client application) peer reviewed -- the FOSS philosophy says, to paraphrase, more eyes means more chances to catch bugs and funny stuff. We want a standard versioning system for our nodes such that there is minimal data loss due to software errors.

Data will be stored in a DHT (OpenDHT?) and indexed by an also distributed key-value store. Nodes will be indexed by a master list shared with your contribution node when you join the network.

What will the user experience be like?
--------------------------------------

We want the user experience to be as simple and foolproof as possible. We want to build in security from the start, not slap it on like really ugly icing at the end. You should not have to learn tor and basically all of networking to be able to set up a hidden-service-like info drop that protects both your privacy and the info recipient.

While contribution via node setup is required for using the service, this sort of contribution may be made at low risk to you. You sign up for VPS space on one of the services we are compatible with (EC2? Digital Ocean? cheapass VPS? Azure? Box?) and log in. You do a `git clone` on our node software repo and get the latest version of our DHT node software. You do a `make` (slash run a script) and automagically the Make fairy sets everything up for you.You may periodically have to log back in to pull down updates and set them up, but we will try to keep it as simple and doable as possible. In order to transfer files, you simply start the clientside (browser) app and follow the simple instructions to encrypt and send your data.

Why should anybody trust you people?
------------------------------------

For one, we do not save your credentials or any information about you other than the identifying information of your node. When your data is transferred into the DHT, a tor-style circuit is built -- your client app chooses the final destination for the data randomly from the publicly available list of nodes, as well as a start point. The encrypted data is wrapped up onion-style and sent to the first node, which has no knowledge of either the endpoint of the data, what the data is (it is encrypted), or whether you are even sending or receiving -- just that a connection has been made from you to it. A fresh set of session keys shall be negotiated for each subsequent hop, meaning that the n-1th node (nth is destination) has no idea who you are or what it is sending, but knows the identifying info for the nth node.

Basically, we are trying to not fuck people over. We do not want your personal information. We do not want your statistics. We do not want your likes, your data, your credentials of any kind, your credit card numbers, or even your real name. You should be able to keep all that private if you choose.

Is this illegal?
----------------

We hope not. A thorough exploration of the U.S./Canada/EU law in this sort of situation will be (hopefully) complete before this project is widely publicised.
