/* Author: 

*/

$(document).ready(function() {   
   
   io.setPath('/client/');
   socket = new io.Socket(null, { 
     port: 8081
     ,transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
   });
   socket.connect();
    
   $('#sender').bind('click', function() {
     socket.send("Message Sent on " + new Date());     
   });
   
   socket.on('message', function(data){
     $('#reciever').append('<li>' + data + '</li>');  
   });

	// flexigrid
		$('.flexme1').flexigrid();
		$('.flexme2').flexigrid({height:'auto',striped:false});

		$("#flex1").flexigrid
		(
		{
		url: 'instances',
		dataType: 'json',
		colModel : [
			{display: 'Instance ID', name : 'instanceId', width: 100, sortable : true, align: 'left'},
			{display: 'Instance State', name : 'instanceState', width: 100, sortable : true, align: 'center'},
			{display: 'Instance Type', name : 'instanceType', width: 100, sortable : true, align: 'left'},
			{display: 'Most Recent Launch Time', name : 'launchTime', width: 250, sortable : true, align: 'right'},
			{display: 'Uptime', name : 'uptime', width: 100, sortable : true, align: 'right'},
			{display: 'Creator', name : 'createdBy', width: 100, sortable : true, align: 'left'},
			{display: 'Reason', name : 'reason', width: 200, sortable : true, align: 'left', hide: true},
			{display: 'Name', name : 'name', width: 100, sortable : true, align: 'left'},
			{display: 'Agency', name : 'agency', width: 75, sortable : true, align: 'left'},
			{display: 'Office', name : 'office', width: 75, sortable : true, align: 'left'},
			{display: 'Client', name : 'client', width: 75, sortable : true, align: 'left'},
			{display: 'Product', name : 'product', width: 75, sortable : true, align: 'left'},
			{display: 'Total Cost ($)', name : 'cost', width: 75, sortable : true, align: 'right'},
			{display: 'MTD Cost ($)', name : 'monthCost', width: 75, sortable : true, align: 'right'}
			],
		searchitems : [
			{display: 'Instance ID', name : 'instanceId'},
			{display: 'Instance State', name : 'instanceState', isdefault: true},
			{display: 'Instance Type', name : 'instanceType'},
			{display: 'Creator', name : 'createdBy'},
			{display: 'Name', name : 'name'},
			{display: 'Agency', name : 'agency'},
			{display: 'Office', name : 'office'},
			{display: 'Client', name : 'client'},
			{display: 'Product', name : 'product'}					
			],
		sortname: "launchTime",
		sortorder: "asc",
		usepager: true,
		singleSelect: true,
		title: 'AWS Instances',
		useRp: true,
		rp: 20,
		showTableToggleBtn: true,
		width: "auto",
		height: "auto"
		}
		);   


		function test(com,grid)
		{
			if (com=='Delete')
				{
					confirm('Delete ' + $('.trSelected',grid).length + ' items?')
				}
			else if (com=='Add')
				{
					alert('Add New Item');
				}			
		}

	$('b.top').click
	(
		function ()
			{
				$(this).parent().toggleClass('fh');
			}
	);

      
 });