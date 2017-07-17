// Demo by Dan Rose.
// See: http://www.sitepoint.com/recreating-google-images-search-layout-css

function _resize() {
    
  $('.imagez.grid .column').each(function(i, e) {
    let fontsize = parseFloat($(e).css('font-size').replace('px', '')),
        left    = Math.ceil(e.getBoundingClientRect().left + fontsize),
        width   = e.getBoundingClientRect().width,
        arrowX  = left + width/2 - $(window).width()/2 - fontsize
    // translate the .expander to be on the lefthand side of the screen
    $(e).find('.expander').css('transform', `translateX(${ -left }px)`)
    // translate the .arrow-up to be on the lefthand side of the screen
    $(e).find('.arrow-up').css('transform', `translateX(${ arrowX }px)`)
  })
}

function init() {  
  console.log('init')
  //bind click events
  let cells = $('.imagez.grid > .column')

  cells.find('.expander').hide()

  $('.imagez.grid > .column > .expand').click(function() {

    let cell = $(this).closest('.column'),
        expander = cell.find('.expander')

    if (!expander.is(":visible")) {
      $('.expander').slideUp() // hide all
      expander.slideDown() }
    else expander.slideUp()
  })
  
  cells.find('.close').click(function() {
    let cell = $(this).closest('.column'),
        expander = cell.find('.expander')
    expander.slideUp()
  })

  _.defer(function(){_resize()})
  $(window).on('resize', function(){_resize()})

}

export default { init: init}