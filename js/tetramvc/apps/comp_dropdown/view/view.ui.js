tetra.view.register('view', {
	use: ['dropdown'],
	scope : 'comp_dropdown',
	constr : function(me, app, _) { return {
	
		events : {		
			user : {
				'click' : {	
					'.dd' : function(e, elm) {
						var btn = elm.find(".dd-btn:first");
						var dd = elm;
						me.methods.initDd(e, btn, dd);
					}
					
				},
				'mouseover' : {	
					'.dd' : function(e, elm) {
						var btn = elm.find(".dd-btn:first");
						var dd = elm;
						me.methods.initDd(e, btn, dd);
					}
					
				},
				'clickout' : {	
					'.dd' : function(e, elm) {
						var btn = elm.find(".dd-btn:first"),
							dd = elm
						;
						/* prevent conflict on multi event handler */
						if(btn.attr("data-event")=="click"){
							me.methods.closeDd(btn, dd);
						}
					}
				},
				'mouseout' : {	
					'.dd' : function(e, elm) {
						var btn = elm.find(".dd-btn:first"),
							dd = elm
						;
						/* prevent conflict on multi event handler */
						if(btn.attr("data-event")=="mouseover"){
							me.methods.closeDd(btn, dd);
						}
					}
				}
			},			
			
			controller : {
				'close all' : function(){
					_('.dd-btn').removeClass("active");
                                	_('.dd').removeClass("open");
				}
			}
		},
		
		methods : {
			init : function(){

			},
			initDd : function (e, btn, dd) {

				/* trigger the required event handler (click or mouseover) */
				var isEvent = btn.attr("data-event") === e.type ? true : false;
				
				if(isEvent && dd){
					
					/* dropdown status  */
					var isOpen = dd.hasClass('open'),
						isDisabled = btn.hasClass("btn-disabled"),
						isloading = btn.hasClass("btn-loading"),
						target = _(e.target)
					;
					
					/* if the dropdown button is not disabled or not loading */
					if( !isDisabled && !isloading ){
						
						/* if the dropdown is not open */
						if( !isOpen ){

							me.methods.openDd(btn, dd);
							
						}else if (target.hasClass('dd-btn') || target.parents('.dd-btn').length > 0){
							/* close dropdown like a toggle event only on click */
							if(e.type === "click"){
								
								me.methods.closeDd(btn, dd);
							}
						}	
					}
					
					/* Broadcast custom parameter on dropdown list openning */
					if (typeof btn.attr('data-custom-param') != 'undefined' && !isOpen)
						app.notify('share btn through apps', btn);

						
					
					return false;
				}				
			},
			openDd : function (btn, dd) {
				btn.addClass("active");
				dd.addClass("open");
			},
			closeDd : function (btn, dd) {
				btn.removeClass("active");
				dd.removeClass("open");
			}
		}
		
	};}
});
