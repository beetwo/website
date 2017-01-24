
(function beeTwo(){
  // require('./semantic-ui/visibility');
  // require('./semantic-ui/sidebar');
  $(document)
      .ready(function() {
        // fix menu when passed
        // $('.masthead')
        //   .visibility({
        //     once: false,
        //     onBottomPassed: function() {
        //       $('.fixed.menu').transition('fade in') },
        //     onBottomPassedReverse: function() {
        //       $('.fixed.menu').transition('fade out') } })
  
        // create sidebar and attach to menu open
        // $('.ui.sidebar').sidebar('attach events', '.toc.item') 

        // initialize the hex grid
        if ($('#pattern').length > 0) 
          require('./pattern/index').init('#pattern', '#cells')
      })
  
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