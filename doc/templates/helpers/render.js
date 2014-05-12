module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('render', function(name, ctx, hash) {
    var ps = Handlebars.partials;
    if(typeof(ps[name]) === 'undefined') {
      // temp dev; then throw an error
      console.log('partial \'' + name + '\' does not exists');
      return '';
    }
    if(typeof ps[name] !== 'function') {
        ps[name] = Handlebars.compile(ps[name]);
    }
    return ps[name](ctx, hash);
  });
};
