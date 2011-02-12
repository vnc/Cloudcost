# Cloudcost

## Description

Cloudcost provides detail into AWS EC2 costs at a level not provided by Amazon.

Cost can be sliced by
  * instance
  * key/value metadata

Cost can be aggregated by
  * month-to-date
  * instance lifetime

_Note that EC2 cost detail prior to use of Cloudcost is unavailable. Cloudcost needs to know when instances start and stop (i.e. needs to be running) to calculate cost accurately._

## Dependencies

### Dependencies you need to install
 * [node.js](https://github.com/ry/node)

### The dependencies below are installed automatically using the installation instructions below.
 * [express](https://github.com/visionmedia/express) (with [connect](https://github.com/senchalabs/connect))
 * [Socket.IO](https://github.com/LearnBoost/Socket.IO)
 * [Socket.IO-node](https://github.com/LearnBoost/Socket.IO-node)
 * [html5-boilerplate](https://github.com/robrighter/html5-boilerplate)
 * [aws-lib](https://github.com/mirkok/aws-lib) (renamed as merger in lib directory)
 * aws-costs
	

## Installation

    $ git clone git://github.com/crcastle/cloudcost.git
    $ cd cloudcost

	# Update submodules
	$ git submodule update --init --recursive

    # Copy the default configuration file
	# and add your AWS account credentials
    $ cp config.json.sample config.json

## Running

	$ node server.js
	
Go to [http://localhost:8081/](http://localhost:8081/)