		
	tetra.view.register('current status display', {
		scope : 'status',
		constr : function(me, app, _){ return {
			events : {
				controller : {
					'display last selected member name' : function(data){
						var statusMessageContainer = _('#selectedItemName');
                                               	statusMessageContainer.fadeOut('fast', function(){
                                                	app.exec("statusMessage", data, function(html) {
                                                		statusMessageContainer.html(html).fadeIn();
                                                	});
                                      		});
                                	}
                        	}
                	}
      		}}
      	});
                        
        tetra.controller.register('current status presenter', {
        	scope : 'status',
               	constr : function(me, app, page, orm){ return {
                	events : {
                        	controller : {
                                	'autocomplete: item selected' : function(details){
                                                app.notify('display last selected member name', {name : details.obj.fullName, memberId: details.obj.memberId, origin : details.origin});
                                        }
                                }
                       	}
               	}}
	});
