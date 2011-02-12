# Cloudcost

## Description

Cloudcost is a node.js web app that provides detail into AWS EC2 costs at a level not provided by Amazon bills or usage reports.

Cost can be sliced by

 * instance
 * key/value metadata

Cost can be aggregated by

 * month-to-date
 * instance lifetime

_Note that EC2 cost detail prior to use of Cloudcost is unavailable. Cloudcost needs to know when instances start and stop (i.e. needs to be running) to calculate cost accurately._

## Dependencies

#### Dependencies you need to install
 * [node.js](https://github.com/ry/node)

#### The dependencies below are installed automatically (as git submodules) using the installation instructions below.
 * [express](https://github.com/visionmedia/express) (with [connect](https://github.com/senchalabs/connect))
 * [Socket.IO](https://github.com/LearnBoost/Socket.IO)
 * [Socket.IO-node](https://github.com/LearnBoost/Socket.IO-node)
 * [html5-boilerplate](https://github.com/robrighter/html5-boilerplate)
 * [aws-lib](https://github.com/mirkok/aws-lib) (renamed as merger in lib directory)
 * [xml2js](https://github.com/maqr/node-xml2js/)
 * [sax](https://github.com/isaacs/sax-js/)
	

## Installation

    $ git clone git://github.com/crcastle/cloudcost.git
    $ cd cloudcost

	# Update submodules
	$ git submodule update --init --recursive

    # Copy the default configuration file
	# and add your AWS account credentials
    $ cp config.json.sample config.json

	# open Clouscost/lib/aws-lib/lib/ec2.js
	# change the date on line 25 to 2009-11-30
	# (or later might work)

## Running

	$ node server.js
	
Go to [http://localhost:8081/](http://localhost:8081/)