export default {
  // detects mobile browsers based on screen width
  // (analogous to/in accordance with to css breakpoints)
  isMobile: () => { return $(window).width() < 768 }
}