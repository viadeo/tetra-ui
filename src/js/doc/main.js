var Mode = function (elem) {
  this.state = this.getState();
  this.$elem = elem;
  if(typeof(localStorage) === 'undefined') {
    $(this.elem).hide();
  }
  return this;
};
Mode.prototype._setState = function (state) {
  if (state) {
    $(this.$elem).removeClass('flipswitch-no').addClass('flipswitch-yes');
    localStorage.setItem("mode", "on")
  } else {
    $(this.$elem).removeClass('flipswitch-yes').addClass('flipswitch-no');
    localStorage.setItem("mode", "off")
  }
  this.state = state;
  toggleCode(state);
  return this;
};
Mode.prototype.getState = function () {
  if(typeof(localStorage) === 'undefined') {
    return false;
  }
  var state = localStorage.getItem('mode') === "on";
  return state;
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
Mode.prototype.init = function (state) {
  this._setState(this.state);
  return this;
};

var toggleCode = function (state) {
  $('.code-content').each(function(i, item){
    if(state){
      $(this).addClass('visible');
    }else {
      $(this).removeClass('visible');
    }
  });
};


$(function(){

  var mode = new Mode($("#mode"));
  mode.bind().init();

  toggleCode(mode.getState());

  $('.main').on('click', '.toggle-code', function(e){
    var container = $(this).parent();
    if(container.hasClass('visible')) {
      container.removeClass('visible');
    }else {
      container.addClass('visible');
    }
  });

});
