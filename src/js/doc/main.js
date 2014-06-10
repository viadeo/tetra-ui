function loadStyle(href) {
  this.$stylesheet.attr('href', href);
}

var Mode = function (elem) {
  this.rtl = false;
  this.$elem = elem;
  this.stylesheet_rtl = this.$elem.attr('data-dir-rtl');
  this.stylesheet_ltr = this.$elem.attr('data-dir-ltr');
  this.$stylesheet = $('link[title=ltr]');
  return this;
};
Mode.prototype._setState = function (state) {
  if (state && !this.rtl) {
    $(this.$elem).removeClass('flipswitch-no').addClass('flipswitch-yes');
    loadStyle.call(this, this.stylesheet_rtl);
    $('body').addClass('rtl').attr('dir', 'rtl');
  } else if (!state && this.rtl) {
    $(this.$elem).removeClass('flipswitch-yes').addClass('flipswitch-no');
    loadStyle.call(this, this.stylesheet_ltr);
    $('body').removeClass('rtl').attr('dir', 'ltr');
  }
  this.rtl = state;
  return this;
};

Mode.prototype.bind = function () {
  var self = this;
  this.$elem.on('click', function(e){
    var state = $(this).hasClass('flipswitch-yes'),
      target = $(e.target);

      if(target.parents('.flipswitch-lbl-yes:first').length) {
        self._setState(true);
      } else if (target.parents('.flipswitch-lbl-no:first').length) {
        self._setState(false);
      } else if (target.parents('.flipswitch-sliders:first').length) {
        self._setState(!state);
      };
  });
  return this;
};

$(function(){

  var mode = new Mode($("#mode"));
  mode.bind();

  $('.main').on('click', '.toggle-code', function(e){
    var container = $(this).parent();
    if(container.hasClass('visible')) {
      container.removeClass('visible');
    }else {
      container.addClass('visible');
    }
  });

});
