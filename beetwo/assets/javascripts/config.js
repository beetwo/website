(function config() {
  var 
    d3      = require('d3'),
    vector  = require('victor')

  module.exports = { 
    GRID_RESOLUTION_MIN : 4,
    GRID_RESOLUTION_MAX : 4,
    GRID_RANDOMIZE      : false,
    SITE_PADDING        : 0.012,
    WITH_CONTENT        : false,
    // FRAME_SCALE         : 0.92,
    FRAME_SCALE         : 1,
    POLYGON_SCALE       : 0.94,
    // SITE_PADDING        : 0.12,
    TRANSITION_DURATION : 0,
    // TRANSITION_DURATION : 640,
    POLYGON_LINE        : d3.line().curve(d3.curveBasisClosed),
    // POLYGON_LINE        : d3.line().curve(d3.curveLinearClosed),
    RESAMPLE            : true,

    CELL_FONT_SIZE      : 18,
    IMAGE_PATH          :'/assets/images/',

    BUTTON_RADIUS       : 28,
    INDICATOR_SVG_PATH  : 'M-56.3 47.9L16 9.9c5.2 -2.6 11.2 -5.6 18 -9v-1.8c-6.8 -3.3 -12.9 -6.3 -18 -9L-56.3 -47.8c0.8 -6.7 4 -12.1 9.7 -16.2l101.7 55.6c1.6 6.6 1.6 12.2 0 17L-46.8 64C-52.4 59.8 -55.6 54.4 -56.3 47.9z',
    INDICATOR_SIZE      : 128,

    // flag for triggering cell animation
    CELL_ANIMATION      : true,
    // CELL_ANIMATION      : false,
    HEADLINE_POSITION   : new vector(1-(1/1.618),1-(1/1.618)),

    // the maximum number of characters in a (cell) headline, before it gets line-broken
    HEAD_MAX_LINE_CHARS : 12,

    NOISE_SCALE         : d3.scaleLinear().domain([-1, 1]).rangeRound([-24, 24]),
    NOISE_TIME_SCALE    : d3.scaleLinear().domain([0, 1000]).range([0, math.PI /24]),

    positionForce       : function() { return { strength:   0.032 }},
    mouseForce          : function() { return { strength:  -0.002 }},
    focusForce          : function() { return { strength: 240 }},
    repelForce          : function() { return {}}
  }})()
