
function constant(x) {return function() { return x }}

export default {
  // detects mobile browsers based on screen width
  // (analogous to/in accordance with to css breakpoints)
  isMobile: function() { return $(window).width() < 768 },
  constant: constant
}