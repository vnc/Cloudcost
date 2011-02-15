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
			{display: 'Instance ID', name : 'ID', width: 100, sortable : true, align: 'left'},
			{display: 'Instance State', name : 'STATE', width: 100, sortable : true, align: 'center'},
			{display: 'Instance Type', name : 'TYPE', width: 100, sortable : true, align: 'left'},
			{display: 'Most Recent Launch Time', name : 'LAUNCH_TIME', width: 250, sortable : true, align: 'right'},
			{display: 'Uptime', name : 'UPTIME', width: 100, sortable : true, align: 'right'},
			{display: 'Creator', name : 'CREATOR', width: 100, sortable : true, align: 'left'},
			{display: 'Reason', name : 'REASON', width: 200, sortable : true, align: 'left', hide: true},
			{display: 'Name', name : 'NAME', width: 100, sortable : true, align: 'left'},
			{display: 'Agency', name : 'AGENCY', width: 75, sortable : true, align: 'left'},
			{display: 'Office', name : 'OFFICE', width: 75, sortable : true, align: 'left'},
			{display: 'Client', name : 'CLIENT', width: 75, sortable : true, align: 'left'},
			{display: 'Product', name : 'PRODUCT', width: 75, sortable : true, align: 'left'},
			{display: 'Total Cost ($)', name : 'COST', width: 75, sortable : true, align: 'right'},
			{display: 'MTD Cost ($)', name : 'MONTH_COST', width: 75, sortable : true, align: 'right'}
			],
		searchitems : [
			{display: 'Instance ID', name : 'ID'},
			{display: 'Instance State', name : 'STATE', isdefault: true},
			{display: 'Instance Type', name : 'TYPE'},
			{display: 'Creator', name : 'CREATOR'},
			{display: 'Name', name : 'NAME'},
			{display: 'Agency', name : 'AGENCY'},
			{display: 'Office', name : 'OFFICE'},
			{display: 'Client', name : 'CLIENT'},
			{display: 'Product', name : 'PRODUCT', isdefault: true}					
			],
		sortname: "COST",
		sortorder: "desc",
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
