tetra.view.register('toggle', {
	scope: 'comp_toggle',
	use: ['toggle'],
	
	constr: function(me, app, _) {
		return {
			events: {
				user: {
					'click': {
						'.btn-toggle': function(e, elm) {

							app.notify('change toggle state', {
								id: elm.attr('id'),
								state: elm.hasClass('btn-toggle-checked')
							});

						}
					}
				},

				controller: {
					'set state': function(data) {
						var container = _('#' + data.id);
						var checkbox = _('input:checkbox', container);

						if (data.state) {
							container.addClass('btn-toggle-checked');
						} else {
							container.removeClass('btn-toggle-checked');
						}

						checkbox.prop('checked', data.state);
					}
				}
			},
			
			methods: {
				init: function() {}
			}
		};
	}
});
