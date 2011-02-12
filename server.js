//setup Dependencies
require(__dirname + "/lib/setup").ext( __dirname + "/lib").ext( __dirname + "/lib/express/support");
var connect = require('connect')
    , express = require('express')
    , sys = require('sys')
	, fs = require('fs')
    , io = require('Socket.IO-node')
	, aws = require('aws-costs')
	, awslib = require('aws-lib'); // this is only included for debugging

//read config.json
try {
  var configJSON = fs.readFileSync(__dirname + "/config.json");
  var config = JSON.parse(configJSON.toString());
} catch(e) {
  console.log("File config.json not found. Try: `cp config.json.sample config.json`");
  console.error(e);
}

//setup default variables
var port = (process.env.PORT || config.port) // use env var, otherwise use value from config.json
	, key = (process.env.AWS_KEY || config.aws_key)
	, secretKey = (process.env.AWS_SECRET || config.aws_secret_key);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyDecoder());
    server.use(connect.staticProvider(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.ejs', { locals: { 
                  header: '#Header#'
                 ,footer: '#Footer#'
                 ,title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){
	console.log('Client Connected');
	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

// get instance data from AWS and setup refresh/reconcile interval
aws.runDataRefresh(key, secretKey, 600000); // refresh every ten minutes


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

server.get('/', function(req, res) {
	res.render('costs.ejs', {
		locals: {
			header: 'AWS EC2 Cost Report'
			,footer: '#Footer#'
			,title : 'AWS EC2 Cost Report'
			,description: 'AWS EC2 Cost Report'
			,author: 'Chris Castle'
			,analyticssiteid: 'XXXXXXX'
		}	
	});
});

server.post('/instances', function(req, res) {
	var query = {
		page: (req.body.page) ? req.body.page : 1
		,rp: (req.body.rp) ? req.body.rp : 15
		,sortname: (req.body.sortname) ? req.body.sortname : 'launchTime'
		,sortorder: (req.body.sortorder) ? req.body.sortorder : 'desc'
	};
	
	aws.getInstances(query, function(dataGrid) {
						res.send(JSON.stringify(dataGrid));
					});

});

server.get('/instance_debug', function(req, res) {
	ec2 = awslib.createEC2Client(key,secretKey);
	ec2.call("DescribeInstances", {}, function(result) {
		res.send(JSON.stringify(result));
	});
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
