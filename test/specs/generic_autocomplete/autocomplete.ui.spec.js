//
// -- Generic autocomplete UI --
//
// @author Cormac Flynn
// @link https://github.com/pivotal/jasmine/wiki
//
describe('the generic autocomplete view', function() {

	'use strict';

	var suggestions = {
		completion: {
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

	beforeEach(function() {

		// Controller / View references
		// ---------------------------------------
		var autocompleteCtrl = tetra.debug.ctrl.retrieve('generic_autocomplete', 'autocomplete');
		this.autocompleteView = tetra.debug.view.retrieve('generic_autocomplete', 'autocomplete');


		// HTML Fixture
		// ---------------------------------------
		loadFixtures('generic_autocomplete/autocomplete.html');

		// Stubs
		// ---------------------------------------
		this.doQueryStub = sinon.stub(autocompleteCtrl.events.view, 'do query');
		this.clickOnSuggestionStub = sinon.stub(autocompleteCtrl.events.view, 'autocompleteGeneric : click on suggestion');
	});

	afterEach(function() {
		this.doQueryStub.restore();
		this.clickOnSuggestionStub.restore();
	});

	// Test specs
	// ------------------------

	it('should display suggestions', function() {
		this.autocompleteView.methods.init();
		this.autocompleteView.methods.reinit(jQuery('#quickSearch')); // Initialise

		// Assert that there are no search results
		expect(VNS.test.query('#autocomplete-suggestionsQuickSearch li').length).toBe(0);

		// Assert that the container has no active class
		expect(document.getElementById('autocomplete-quicksearch-header').className.indexOf('active')).toBe(-1);

		// Set a value in the input field
		document.getElementById("quickSearch").value = 'foo';

		// Return the query response
		tetra.view.notify('display suggestions', {
			status: 'SUCCESS',
			id: 'autocomplete-quicksearch-header',
			data: suggestions,
			count: 2
		}, "generic_autocomplete");

		// Assert that there are two search results plus the 'all results' link
		expect(VNS.test.query('#autocomplete-suggestionsQuickSearch li').length).toBe(3);

		// Assert that the container has an active class
		expect(document.getElementById('autocomplete-quicksearch-header').className.indexOf('active')).not.toBe(-1);
	});

	it('should handle zero suggestions', function() {
		this.autocompleteView.methods.init();
		this.autocompleteView.methods.reinit(jQuery('#quickSearch')); // Initialise

		// Assert that there are no search results
		expect(VNS.test.query('#autocomplete-suggestionsQuickSearch li').length).toBe(0);

		// Assert that the container has no active class
		var header = document.getElementById('autocomplete-quicksearch-header');
		expect(header.className.indexOf('active')).toBe(-1);

		// Set the class to active
		header.className = 'autocomplete active';

		// Add an <li> to the menu list
		var menu = document.getElementById('autocomplete-suggestionsQuickSearch');
		menu.innerHTML = '<li></li>';

		// Set a value in the input field
		document.getElementById("quickSearch").value = 'foo';

		// Return the query response with NO suggestions
		tetra.view.notify('display suggestions', {
			status: 'SUCCESS',
			id: 'autocomplete-quicksearch-header',
			data: {},
			count: 2
		}, "generic_autocomplete");

		// Assert that there are no search results
		expect(VNS.test.query('#autocomplete-suggestionsQuickSearch li').length).toBe(0);

		// Assert that the container has *no* active class
		expect(document.getElementById('autocomplete-quicksearch-header').className.indexOf('active')).toBe(-1);
	});

	it('should display value', function() {
		this.autocompleteView.methods.init();
		this.autocompleteView.methods.reinit(jQuery('#quickSearch')); // Initialise

		var header = document.getElementById('autocomplete-quicksearch-header');
		header.className = 'active';

		tetra.view.notify('display value', {
			value: 'new value'
		}, "generic_autocomplete");

		expect(document.getElementById("quickSearch").value).toBe('new value');
		expect(header.className.indexOf('active')).toBe(-1);
	});

	// User action test specs
	// ------------------------

	xit('should do something on keydown .autocomplete input', function() {
		expect(false).toBe(true);
	});
	xit('should do something on keyup .autocomplete input', function() {
		expect(false).toBe(true);
	});
	xit('should do something on focus .autocomplete input', function() {
		expect(false).toBe(true);
	});
	xit('should do something on blur .autocomplete input', function() {
		expect(false).toBe(true);
	});
	xit('should do something on click .autocomplete .autocomplete-menu li', function() {
		expect(false).toBe(true);
	});
});