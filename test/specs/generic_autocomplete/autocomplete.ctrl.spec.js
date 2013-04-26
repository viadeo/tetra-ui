// -- The generic autocomplete functionality --
//
// @author Cormac Flynn
// @link https://github.com/pivotal/jasmine/wiki
//
describe('the generic autocomplete model-controller', function() {

	'use strict';

	var autocompleteFetchData = {
		"completion": {
			"1": {
				fullName: "First Name",
				hasPhoto: false,
				headline: "Foo",
				isDirectContact: true,
				memberId: "1",
				tsPhoto: 123
			},
			"2": {
				fullName: "Second Name",
				hasPhoto: true,
				headline: "Bar",
				isDirectContact: true,
				memberId: "2",
				tsPhoto: 123
			}
		}
	};

	var autocompleteFetch2Data = {
		"completion": {
			"3": {
				fullName: "Second Name",
				hasPhoto: false,
				headline: "Blah",
				isDirectContact: true,
				memberId: "3",
				tsPhoto: 123
			},
			"4": {
				fullName: "Third Name",
				hasPhoto: true,
				headline: "Bar",
				isDirectContact: true,
				memberId: "4",
				tsPhoto: 123
			}
		}
	};

	var autocompleteFetch_GET = {
		"status": "SUCCESS",
		"data": autocompleteFetchData,
		"alerts": {},
		"errors": []
	};

	var autocompleteFetch2_GET = {
		"status": "SUCCESS",
		"data": autocompleteFetch2Data,
		"alerts": {},
		"errors": []
	};

	var FAIL = {
		"status": "FAIL",
		"data": {},
		"alerts": {},
		"errors": []
	};

	beforeEach(function() {

		// Controller / View references
		// ---------------------------------------
		var autocompleteCtrl = tetra.debug.ctrl.retrieve('generic_autocomplete', 'autocomplete');
		var autocompleteView = tetra.debug.view.retrieve('generic_autocomplete', 'autocomplete');

		// Fake Servers & Response Paths
		// ---------------------------------------
		this.server = sinon.fakeServer.create();

		this.server.respondWith('GET', /query\?ts=.*&id=.*&url=query&q=test&typingDelay=400/,
			[200, {'Content-type': 'application/json' }, JSON.stringify(autocompleteFetch_GET)]);

		this.server.respondWith('GET', /query\?ts=.*&id=.*&url=query&q=foo&typingDelay=400/,
			[200, {'Content-type': 'application/json' }, JSON.stringify(autocompleteFetch2_GET)]);

		this.server.respondWith('GET', /fail_flag/,
			[200, {'Content-type': 'application/json' }, JSON.stringify(FAIL)]);
		this.server.respondWith('GET', /error_flag/,
			[500, {'Content-type': 'application/json' }, ""]);

		// Clocks
		// ----------------------

		this.clock = sinon.useFakeTimers();

		// Stubs
		// ---------------------------------------
		this.displaySuggestionsStub = sinon.stub(autocompleteView.events.controller, 'display suggestions');
		this.displayValueStub = sinon.stub(autocompleteView.events.controller, 'display value');
	});

	afterEach(function() {
		this.server.restore();
		this.clock.restore();
		this.displaySuggestionsStub.restore();
		this.displayValueStub.restore();
	});

	// Test specs
	// ------------------------

	it('should query the server for contact suggestions', function() {

		tetra.controller.notify('do query', {
			id: "autocomplete-quicksearch-header",
			url: "query",
			q: "test",
			typingDelay: 400
		}, "generic_autocomplete");

		this.clock.tick(500);
		this.server.respond();

		expect(this.displaySuggestionsStub.callCount).toBe(1);
		var args = this.displaySuggestionsStub.getCall(0).args[0];
		expect(args.data).toEqual(autocompleteFetchData);
	});

	it('should be able to perform multiple queries in sequence', function() {

		// Query 1 - test
		tetra.controller.notify('do query', {
			id: "autocomplete-quicksearch-header",
			url: "query",
			q: "test",
			typingDelay: 400
		}, "generic_autocomplete");

		this.clock.tick(500);
		this.server.respond();

		expect(this.displaySuggestionsStub.callCount).toBe(1);
		var args = this.displaySuggestionsStub.getCall(0).args[0];
		expect(args.data).toEqual(autocompleteFetchData);

		// Query 2 - foo
		tetra.controller.notify('do query', {
			id: "autocomplete-quicksearch-header",
			url: "query",
			q: "foo",
			typingDelay: 400
		}, "generic_autocomplete");

		this.clock.tick(500);
		this.server.respond();

		expect(this.displaySuggestionsStub.callCount).toBe(2);
		args = this.displaySuggestionsStub.getCall(1).args[0];
		expect(args.data).toEqual(autocompleteFetch2Data);

		// Perform Query 1 again
		tetra.controller.notify('do query', {
			id: "autocomplete-quicksearch-header",
			url: "query",
			q: "test",
			typingDelay: 400
		}, "generic_autocomplete");

		this.clock.tick(500);
		this.server.respond();

		expect(this.displaySuggestionsStub.callCount).toBe(3);
		args = this.displaySuggestionsStub.getCall(2).args[0];

		expect(args.data).toEqual(autocompleteFetchData);
	});

	it('should notify the page that a suggestion has been clicked', function() {
		// Setup a new controller
		var spy = sinon.spy();
		tetra.controller.register('test', {
			scope: 'generic_autocomplete',
			constr: function(me, app, page, orm) {

				return {
					events: {
						view: {
							'autocompleteGeneric : click on suggestion': function() {
								spy();
							}
						},

						methods: {
							init: function() {

							}
						}
					}
				};
			}
		});

		tetra.controller.notify('autocompleteGeneric : click on suggestion', {foo: "bar"}, "generic_autocomplete");
		expect(spy.callCount).toBe(1);
		tetra.controller.destroy('test', 'generic_autocomplete');
	});
});