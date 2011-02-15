# Cloudcost

## Inspriation

_"When performance is measured, performance improves. When performance is measured and reported back, the rate of improvement accelerates."_

_Thomas S. Monson. Favorite Quotations from the Collection of Thomas S. Monson. Deseret Books, 1985_

_[http://www.tdan.com/i010ht03.htm](http://www.tdan.com/i010ht03.htm)_

_[Thomas S. Monson](http://en.wikipedia.org/wiki/Thomas_S._Monson)_

Honestly the inspiration was my boss and our exponentially increasing AWS bill... but this sounds cooler.

## About

Cloudcost is a node.js web app that provides detail into AWS EC2 costs at a level not available in Amazon bills or usage reports.

Cost can be sliced by

 * instance
 * key/value metadata

Cost can be aggregated by

 * month-to-date
 * instance lifetime

_Note that EC2 cost detail prior to use of Cloudcost is unavailable. Cloudcost needs to know when instances start and stop (i.e. needs to be running) to calculate cost accurately._

## Dependencies

#### Dependencies you need to figure out
 * [node.js](https://github.com/ry/node)
 * Any time an instance is started, stopped, or terminated a GET request needs to be made like the following:  

**This webservice is not yet implemented!! To get instance history a log in simpledb is currently used.**
**The aim of the webservice is to abstract away the use of a custom simpledb domain.**

	http://localhost:8081/ec2?action=create&instanceId=i-e890bce7
	http://localhost:8081/ec2?action=start&instanceId=i-e890bce7
	http://localhost:8081/ec2?action=stop&instanceId=i-e890bce7
	http://localhost:8081/ec2?action=terminate&instanceId=i-e890bce7

#### The dependencies below are installed automatically (as git submodules) using the installation instructions below.
 * [express](https://github.com/visionmedia/express) (with [connect](https://github.com/senchalabs/connect))
 * [Socket.IO](https://github.com/LearnBoost/Socket.IO)
 * [Socket.IO-node](https://github.com/LearnBoost/Socket.IO-node)
 * [html5-boilerplate](https://github.com/robrighter/html5-boilerplate)
 * [aws-lib](https://github.com/mirkok/aws-lib)
 * [simpledb](https://github.com/rjrodger/simpledb)
 * [nodejs-clone-extend](https://github.com/shimondoodkin/nodejs-clone-extend) (renamed as merger in lib directory)
 * [xml2js](https://github.com/maqr/node-xml2js/)
 * [sax](https://github.com/isaacs/sax-js/)
	

## Installation

    $ git clone git://github.com/crcastle/cloudcost.git
    $ cd Cloudcost

	# Update submodules
	$ git submodule update --init --recursive

    # Copy the default configuration file
	# and add your AWS account credentials
	# note that credentials are defined separately for ec2 and simpledb
    $ cp config.json.sample config.json

	# open Clouscost/lib/aws-lib/lib/ec2.js
	# change the date on line 25 to 2010-11-15
	# if you don't do this, instance tags will not show up

## Running

	$ node server.js

Once it you see "dataGrid refreshed" at least one time on the console you're ready to go. 
Total Cost and MTD (month-to-date) Cost will take a little time to update depending on how many instances you have and how many starts and stops there are for each.

Go to [http://localhost:8081/](http://localhost:8081/)