
function constant(x) {return function() { return x }}
function isMobile() { return $(window).width() < 768 }

export default {
  // detects mobile browsers based on screen width
  // (analogous to/in accordance with to css breakpoints)
  isMobile: isMobile,
  constant: constant
}