//setup Dependencies
var awslib = require('aws-lib');
var cloner = require('merger');

// global var
var dataGrid = null;

// some constants for array indices
var ID = 0;
var STATE = 1;
var TYPE = 2;
var LAUNCH_TIME = 3;
var UPTIME = 4;
var CREATOR = 5;
var REASON = 6;
var NAME = 7;
var AGENCY = 8;
var OFFICE = 9;
var CLIENT = 10;
var PRODUCT = 11;
var COST = 12;


var refreshDataGrid = function(key, secretKey) {
	ec2 = awslib.createEC2Client(key,secretKey);
	ec2.call("DescribeInstances", {}, function(result) {

		var rows = [];
		for (var i = 0; i < (result['reservationSet']['item']).length; i++) {
			var instanceProperties = result['reservationSet']['item'][i]['instancesSet']['item']; 

			// populate all cells in a row
			var cells = [];

			// instance id
			cells[ID] = instanceProperties['instanceId'];

			// instance state (running, stopped, or terminated)
			cells[STATE] = (instanceProperties['instanceState']) ? instanceProperties['instanceState']['name'] : "";

			// instance type (e.g. m1.large)
			cells[TYPE] = instanceProperties['instanceType'];

			// start date (in local time zone)
			var startDate = new Date(instanceProperties['launchTime']);
			cells[LAUNCH_TIME] = startDate.toLocaleString();

			// uptime (in months, days, hours, and minutes)
			var now = new Date();
			var msecPerMonth = 1000 * 60 * 60 * 24 * 30.33333333333;
			var msecPerDay = 1000 * 60 * 60 * 24;
			var msecPerHour = 1000 * 60 * 60;
			var msecPerMinute = 1000 * 60;
			var msecUp = now - startDate;
			var months = Math.floor(msecUp / msecPerMonth);
			var days = Math.floor((msecUp - (months * msecPerMonth)) / msecPerDay);
			var hours = Math.floor((msecUp - (months * msecPerMonth) - (days * msecPerDay)) / msecPerHour);
			var minutes = Math.floor((msecUp - (months * msecPerMonth) - (days * msecPerDay) - (hours * msecPerHour)) / msecPerMinute);
			cells[UPTIME] = (months==0 ? "" : months + "m") +
							(days==0 ? "" : days + "d") +
							(hours==0 ? "" : hours + "h") +
							(minutes==0 ? "" : minutes + "m");

			// creator
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Created By') {
						cells[CREATOR] = typeof(instanceProperties['tagSet']['item'][j]['value']) ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[CREATOR] = "";
			}
				
			// stop or terminate reason
			cells[REASON] = typeof(instanceProperties['reason']) == "string" ? instanceProperties['reason'] : "";
			
			// specify name
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Name') {
						cells[NAME] = typeof(instanceProperties['tagSet']['item'][j]['value']) ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[NAME] = "";
			}
			
			// specify agency
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Agency') {
						cells[AGENCY] = typeof(instanceProperties['tagSet']['item'][j]['value']) ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[AGENCY] = "";
			}
			
			// specify office
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Office') {
						cells[OFFICE] = typeof(instanceProperties['tagSet']['item'][j]['value']) == "string" ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[OFFICE] = "";
			}		
				
			// specify client
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Client') {
						cells[CLIENT] = typeof(instanceProperties['tagSet']['item'][j]['value']) == "string" ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[CLIENT] = "";
			}
						
			// specify product
			if (instanceProperties['tagSet']) {
				for (j = 0; j < (instanceProperties['tagSet']['item']).length; j++) {
					if (instanceProperties['tagSet']['item'][j]['key'] == 'Product') {
						cells[PRODUCT] = typeof(instanceProperties['tagSet']['item'][j]['value']) == "string" ?
											instanceProperties['tagSet']['item'][j]['value'] :
											"";
					}
				}
			} else {
				cells[PRODUCT] = "";
			}
			
			// cost (if running)
			// and assumes running 100% of time
			// TODO: EC2 instance prices should be user configurable
			// so that code doesn't need to change when AWS changes prices
			var ec2Prices = [
				{
					name: "c1.medium",
					price: .29
				},
				{
					name: "m1.large",
					price: .48
				},
				{
					name: "m1.small",
					price: .12
				},
				{
					name: "m1.xlarge",
					price: .96
				},
				{
					name: "m2.2xlarge",
					price: 1.24
				},
				{
					name: "m2.xlarge",
					price: .62
				}
			];
			
			var cost = 0;
			if (cells[STATE] == "running") {
				var hours = (new Date() - new Date(instanceProperties['launchTime'])) / 1000 / 60 / 60;
				for (var m = 0; m < ec2Prices.length; m++) {
					if (ec2Prices[m].name == cells[TYPE]) {
						cost = (Math.round(hours * ec2Prices[m].price*100)/100).toFixed(2);
					}
				}
			}
			cells[COST] = cost;

			// add cells to row object
			var row = {
				id: instanceProperties['instanceId']
				,cell: cells
			};

			// add row to rows object
			if (row.cell[ID] && row.cell[ID] != "") rows.push(row);
		}

		// add current page number, total row count, and rows to dataGrid object
		dataGrid = {
			page: 1
			,total: (result['reservationSet']['item']).length
			,rows: rows
		};
		console.log("dataGrid refreshed.");

		// call callback with dataGrid object
		//callback(dataGrid);
	});
}

exports.runDataRefresh = function(key, secretKey, interval) {
	try {
		refreshDataGrid(key, secretKey);
		setInterval(refreshDataGrid, interval, key, secretKey);
	} catch(err) {
		console.error("Error refreshing dataGrid: " + err);
	}
};

exports.getInstances = function(query, callback) {
	// make a clone of the dataGrid so that we can sort it and handle paging without
	// getting in the way of any updates that might happen from runDataRefresh
	var dataGridCopy = cloner.clone(dataGrid);
	
	// get sort and paging parameters
	var page = parseInt(query.page);
	var rp = parseInt(query.rp);
	var sortname = query.sortname;
	var sortorder = query.sortorder;
	
	// set summary info in dataGridCopy object
	dataGridCopy.page = page;
	dataGridCopy.total = (dataGridCopy.rows).length;
	
	// sort rows array
	dataGridCopy.rows.sort(function(a,b) {
		var diff = 0;
		switch(sortname) {
			case 'instanceId':
				if (!a.cell[ID] || !b.cell[ID]) { diff = -1; break; }
				if (!a.cell[ID] && !b.cell[ID]) { diff = 0; break; }
				if (a.cell[ID].toLowerCase() < b.cell[ID].toLowerCase()) { diff = -1; }
				else if (a.cell[ID].toLowerCase() > b.cell[ID].toLowerCase()) { diff = 1; }
				break;
			case 'instanceState':
				if (!a.cell[STATE] || !b.cell[STATE]) { diff = -1; break; }
				if (!a.cell[STATE] && !b.cell[STATE]) { diff = 0; break; }
				if (a.cell[STATE].toLowerCase() < b.cell[STATE].toLowerCase()) { diff = -1; }
				else if (a.cell[STATE].toLowerCase() > b.cell[STATE].toLowerCase()) { diff = 1; }
				break;
			case 'instanceType':
				if (!a.cell[TYPE] || !b.cell[TYPE]) { diff = -1; break; }
				if (!a.cell[TYPE] && !b.cell[TYPE]) { diff = 0; break; }
				if (a.cell[TYPE].toLowerCase() < b.cell[TYPE].toLowerCase()) { diff = -1; }
				else if (a.cell[TYPE].toLowerCase() > b.cell[TYPE].toLowerCase()) { diff = 1; }
				break;
			case 'launchTime':
				diff = (new Date(a.cell[LAUNCH_TIME]) - new Date(b.cell[LAUNCH_TIME]));
				break;
			case 'uptime':
				diff = (new Date(b.cell[LAUNCH_TIME]) - new Date(a.cell[LAUNCH_TIME]));
				break;
			case 'createdBy':
				if (!a.cell[CREATOR] || !b.cell[CREATOR]) { diff = -1; break; }
				if (!a.cell[CREATOR] && !b.cell[CREATOR]) { diff = 0; break; }
				if (a.cell[CREATOR].toLowerCase() < b.cell[CREATOR].toLowerCase()) { diff = -1; }
				else if (a.cell[CREATOR].toLowerCase() > b.cell[CREATOR].toLowerCase()) { diff = 1; }
				break;
			case 'reason':
				if (!a.cell[REASON] || !b.cell[REASON]) { diff = -1; break; }
				if (!a.cell[REASON] && !b.cell[REASON]) { diff = 0; break; }
				if (a.cell[REASON].toLowerCase() < b.cell[REASON].toLowerCase()) { diff = -1; }
				else if (a.cell[REASON].toLowerCase() > b.cell[REASON].toLowerCase()) { diff = 1; }
				break;
			case 'name':
				if (!a.cell[NAME] || !b.cell[NAME]) { diff = -1; break; }
				if (!a.cell[NAME] && !b.cell[NAME]) { diff = 0; break; }
				if (a.cell[NAME].toLowerCase() < b.cell[NAME].toLowerCase()) { diff = -1; }
				else if (a.cell[NAME].toLowerCase() > b.cell[NAME].toLowerCase()) { diff = 1; }
				break;
			case 'agency':
				if (!a.cell[AGENCY] || !b.cell[AGENCY]) { diff = -1; break; }
				if (!a.cell[AGENCY] && !b.cell[AGENCY]) { diff = 0; break; }
				if (a.cell[AGENCY].toLowerCase() < b.cell[AGENCY].toLowerCase()) { diff = -1; }
				else if (a.cell[AGENCY].toLowerCase() > b.cell[AGENCY].toLowerCase()) { diff = 1; }
				break;
			case 'office':
				if (!a.cell[OFFICE] || !b.cell[OFFICE]) { diff = -1; break; }
				if (!a.cell[OFFICE] && !b.cell[OFFICE]) { diff = 0; break; }
				if (a.cell[OFFICE].toLowerCase() < b.cell[OFFICE].toLowerCase()) { diff = -1; }
				else if (a.cell[OFFICE].toLowerCase() > b.cell[OFFICE].toLowerCase()) { diff = 1; }
				break;
			case 'client':
				if (!a.cell[CLIENT] || !b.cell[CLIENT]) { diff = -1; break; }
				if (!a.cell[CLIENT] && !b.cell[CLIENT]) { diff = 0; break; }
				if (a.cell[CLIENT].toLowerCase() < b.cell[CLIENT].toLowerCase()) { diff = -1; }
				else if (a.cell[CLIENT].toLowerCase() > b.cell[CLIENT].toLowerCase()) { diff = 1; }
				break;
			case 'product':
				if (!a.cell[PRODUCT] || !b.cell[PRODUCT]) { diff = -1; break; }
				if (!a.cell[PRODUCT] && !b.cell[PRODUCT]) { diff = 0; break; }
				if (a.cell[PRODUCT].toLowerCase() < b.cell[PRODUCT].toLowerCase()) { diff = -1; }
				else if (a.cell[PRODUCT].toLowerCase() > b.cell[PRODUCT].toLowerCase()) { diff = 1; }
				break;
			case 'cost':
				diff = parseFloat(a.cell[COST]) - parseFloat(b.cell[COST]);
				break;
		}
		if (sortorder == 'desc') diff = diff * -1;
		return diff;
	});
	
	// get only requested row count and page
	var newRows = [];
	var startRow = rp * (page - 1);
	var endRow = (rp * page) - 1;
	for (var k = 0; k < (dataGridCopy.rows).length; k++){
		if (k >= startRow && k <= endRow) {
			newRows.push(dataGridCopy.rows[k]);
		}
	}
	dataGridCopy.rows = newRows;
	
	// send data to caller
	callback(dataGridCopy);
};