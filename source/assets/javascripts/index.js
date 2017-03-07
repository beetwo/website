
(function beeTwo(){

  // require('./semantic-ui/accordion')
  require('./semantic-ui/api')
  // require('./semantic-ui/checkbox')
  // require('./semantic-ui/colorize')
  // require('./semantic-ui/dimmer')
  // require('./semantic-ui/dropdown')
  // require('./semantic-ui/embed')
  // require('./semantic-ui/form')
  require('./semantic-ui/modal')
  // require('./semantic-ui/nag')
  // require('./semantic-ui/popup')
  // require('./semantic-ui/progress')
  // require('./semantic-ui/rating')
  require('./semantic-ui/search')
  require('./semantic-ui/shape')
  require('./semantic-ui/sidebar')
  require('./semantic-ui/site')
  require('./semantic-ui/state')
  require('./semantic-ui/sticky')
  require('./semantic-ui/tab')
  require('./semantic-ui/transition')
  // require('./semantic-ui/video')
  require('./semantic-ui/visibility')
  require('./semantic-ui/visit')
  
  var SVGMorpheus = require('./svg-morpheus')


  // ————————————————————————————————
  // smooth scrolling
  // @see: https://css-tricks.com/snippets/jquery/smooth-scrolling/
  // ————————————————————————————————
  function scrollSmoothly() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  }

  $(document)
      .ready(function() {

        // menu
        // ————————————————————————————————
        var tocOptions  = { iconId:   'toc',
                            duration: 400,
                            rotation: 'none'},
            tocIcons    = new SVGMorpheus('#toc > #iconset', tocOptions)

        $('.ui.sidebar')
          .sidebar({onVisible:  () => { tocIcons.to('close')
                                        $('#toc').addClass('open')},
                    onHide:     () => { tocIcons.to('toc')
                                        $('#toc').removeClass('open')}})
        $('.ui.sidebar').sidebar('attach events', '#toc')

        $('.ui.sidebar a.item').click(() => { $('.ui.sidebar').sidebar('hide') })

        // pattern
        // ————————————————————————————————
        // if ($('#pattern').length > 0) require('./pattern/index').init('#pattern', '#cells') 

        // smooth scrolling
        // ————————————————————————————————
        scrollSmoothly() })
  
  if (__DEVELOPMENT__) {
    console.log("Running in development mode!");
  }
  
  if (__DEBUG__) {
    console.log("Running in debug mode!");
  }
  
  if (__BUILD__) {
    console.log("Welcome to bee two");
  }
})()