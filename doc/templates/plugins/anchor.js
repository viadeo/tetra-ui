// <h1 id="glyphicons">Glyphicons</h1>

// After

// <h1 class="docs-heading">
//   <a href="#heading-id-name" name="heading-id-name" class="anchor">
//     <span class="anchor-target" id="heading-id-name"></span>
//     <i aria-hidden="true" class="vicon">⊙</i>
//   </a>
//   Glyphicons
// </h1>


module.exports = [
  '<a href="#<%= id %>" name="<%= id %>" class="anchor">',
  '  <span class="anchor-target" id="<%= id %>"></span>',
  '  <i aria-hidden="true" class="vicon vicon-target"></i>',
  '</a>'
].join('\n');
