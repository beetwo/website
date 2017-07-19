
import transition from 'd3-transition'
import {selectAll} from 'd3-selection'
import util from '../util'

// See: http://www.sitepoint.com/recreating-google-images-search-layout-css

function _resize() {
    
  $('.imagez.grid .column').each(function(i, e) {
    let fontsize = parseFloat($(e).css('font-size').replace('px', '')),
        left    = Math.ceil(e.getBoundingClientRect().left),
        width   = e.getBoundingClientRect().width,
        arrowX  = left + width/2 - $(window).width()/2 - fontsize

    // dunno exactly where this comes from
    // on non mobile displays the expander gets not aligned properly
    // probably something to do with container padding or whatnot…
    if(!util.isMobile()) left += fontsize

    // translate the .expander to be on the lefthand side of the screen
    $(e).find('.expander').css('transform', `translateX(${ -left }px)`)
    // translate the .arrow-up to be on the lefthand side of the screen
    $(e).find('.arrow-up').css('transform', `translateX(${ arrowX }px)`)
  })
}

function init() {  
  //bind click events
  let cells = $('.imagez.grid > .column')

  cells.find('.expander').hide()

  $('.imagez.grid > .column > .expand').click(function() {
    
    let cell = $(this).closest('.column'),
        expander = cell.find('.expander')

    if (!expander.is(":visible")) {
      $('.expander').slideUp() // hide all
      
      // fold down all overlays
      $('.imagez.grid > .column > .expand').removeClass('active')

      $(this).addClass('active')
      expander.slideDown() }

    else {
      expander.slideUp()
      $(this).removeClass('active')
    }
  })
  
  cells.find('.close').click(function() {
    let cell = $(this).closest('.column'),
        expander = cell.find('.expander')
    expander.slideUp()
  })

  _.defer(function(){
    _resize()

    // make visible
    selectAll('.imagez.grid > .column')
      .transition()
      .duration(800)
      .delay(function(n, i) {return i * 240})
      .style('opacity', 1)


  })
  $(window).on('resize', function(){_resize()})

}

export default { init: init}