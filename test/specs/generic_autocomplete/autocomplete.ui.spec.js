// 'View' Spec Skeleton
// ---------------------------------------
//
// !! REMEMBER !!
//      The file generic_autocomplete/autocomplete.html in the fixtures directory is empty; fill it with the minimum HTML
//      required for the view to function
//
// And
//      replace this comment with proper documentation of your test!

//
// -- Add description here --
//
// @author your name
// @link https://github.com/pivotal/jasmine/wiki
//
describe('generic_autocomplete/autocomplete view', function() {

    'use strict';

    beforeEach(function() {
        
        // Controller / View references
        // ---------------------------------------
        var autocompleteCtrl = tetra.debug.ctrl.retrieve('generic_autocomplete', 'autocomplete');
        var autocompleteView = tetra.debug.view.retrieve('generic_autocomplete', 'autocomplete');
        
        
        // HTML Fixture
        // ---------------------------------------
        loadFixtures('generic_autocomplete/autocomplete.html');
        
        // Stubs
        // ---------------------------------------
        this.doqueryStub = sinon.stub(autocompleteCtrl.events.view, 'do query');
        this.autocompleteGenericclickonsuggestionStub = sinon.stub(autocompleteCtrl.events.view, 'autocompleteGeneric : click on suggestion');
    });

    afterEach(function() {
        this.doqueryStub.restore();
        this.autocompleteGenericclickonsuggestionStub.restore();
    });

    // Test specs
    // ------------------------
    
    xit('should display suggestions', function(){
        expect(false).toBe(true);
    });
    
    xit('should display value', function(){
        expect(false).toBe(true);
    });
    
    

    // User action test specs
    // ------------------------
    
    
    xit('should do something on keydown .autocomplete input', function(){
        expect(false).toBe(true);
    });
    xit('should do something on keyup .autocomplete input', function(){
        expect(false).toBe(true);
    });
    xit('should do something on focus .autocomplete input', function(){
        expect(false).toBe(true);
    });
    xit('should do something on blur .autocomplete input', function(){
        expect(false).toBe(true);
    });
    xit('should do something on click .autocomplete .autocomplete-menu li', function(){
        expect(false).toBe(true);
    });
    
});