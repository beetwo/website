
(function bloom() {
  const d3          = require('d3'),
        vector      = require('../vector')

  const HEXAGON   = 'M-6.935577799999997 -59.9957423C-3.105163900000001 -62.20723276 3.0986864999999995 -62.21097249 6.935577800000004 -59.9957423L48.490048 -36.0042577C52.320462000000006 -33.7927672 55.425625999999994 -28.421945 55.425625999999994 -23.9914846L55.425625999999994 23.991484600000007C55.425625999999994 28.414465500000006 52.326938999999996 33.7890275 48.490048 36.00425799999999L6.935577800000004 59.99574200000001C3.1051638999999938 62.207233 -3.0986864999999995 62.210972 -6.935577799999997 59.99574200000001L-48.490048099999996 36.00425799999999C-52.3204619 33.7927672 -55.42562584 28.421944999999994 -55.42562584 23.991484600000007L-55.42562584 -23.9914846C-55.42562584 -28.4144655 -52.3269393 -33.7890275 -48.490048099999996 -36.0042577L-6.935577799999997 -59.9957423z'
  const PALLETE   = ['#ffcf97', '#9edee4', '#dff8ac', '#b3ebbc', '#f46064', '#afa5fb']
  const SECTIONS  = ['index', 'focus', 'principles', 'team']
  const COUNT     = 4
  const DURATION  = 1000
  const MAX_SCALE = 12

  let hexScale    = d3.scaleLinear().domain([320, 1920]).range([1, 4.2]), // the width of the scaled hexagon 
      unitSegment

  function radToDeg(rad)        { return math.round(rad *  180 / math.pi) }
  function degToRad(deg)        { return deg * math.pi / 180 }
  function color(index)         { return _.nth(PALLETE, (index % COUNT)) }
  function xFocus(w)            { return w * 0.25 }
  function yFocus(h)            { return h * 0.38 }
  function section(index)       { if(index < _.size(SECTIONS)) return _.nth(SECTIONS, index) 
                                  return null }
  function _getSegment(β, {id}) { return _.find(β.segments, (σ) => { return σ.id === id })}

  //              _
  //  ___ __ __ _| |___ ___
  // (_-</ _/ _` | / -_|_-<
  // /__/\__\__,_|_\___/__/
  function _domain(id, top, height, hexWidth, totalHeight) {
    if(id === 'index') 
      return [0, 
              0.1 * height, 
              0.2 * height, 
              1.2 * height,  
              math.Infinity]
    else if(id === 'focus') 
      return [0, 
              0.24 * top,
              top,
              top + height,
              math.Infinity]
    else 
      return [0, 
              top - window.innerHeight, 
              top,
              totalHeight,  
              math.Infinity]}

  function _range(id, top, height, hexWidth, totalHeight) {
    if(id === 'index') return [ 1, 1, 1, 1, 1]
    else return [ 1, 1, MAX_SCALE, 1, 1]}

  function _ϱDomain(id, top, height, hexWidth, totalHeight) {
    if(id === 'index') 
      return [0, 
              0.24 * window.innerHeight,
              height,  
              0.9 * totalHeight,
              totalHeight,
              math.Infinity]
    else if(id === 'focus') 
      return [0, 
              0.24 * top,
              top,
              top + height,
              top + (2 * height),
              0.9 * totalHeight,
              totalHeight,
              math.Infinity]
   
    else
    // else if(id === 'team') 
      return [0, 
              0.24 * window.innerHeight,
              window.innerHeight, 
              top - window.innerHeight, 
              top, 
              // top + window.innerHeight, 
              totalHeight, 
              math.Infinity]

    // else 
    //   return [0, 
    //           0.24 * window.innerHeight,
    //           window.innerHeight, 
    //           top - window.innerHeight, 
    //           top, 
    //           top + height, 
    //           top + top + height + window.innerHeight, 
    //           0.9 * totalHeight, 
    //           totalHeight, 
    //           math.Infinity]
            }

  function _ϱRange(id, top, height, hexWidth, totalHeight) {
    let min  = 4,
        norm = hexWidth,
        max  = norm * MAX_SCALE
        

    if(id === 'index') 
      return [min,  // 0,
              min,  // 0.24 * window.innerHeight,
              norm, // height,
              norm, // 0.9 * totalHeight,
              8 * min,  // totalHeight,
              8 * min   // math.Infinity
              ]

    else if(id === 'focus') 
      return [min,  // 0,
              min,  // 0.24 * top,
              max,  // top,
              max,  // top + height,
              norm, // top + (2 * height),
              norm, // 0.9 * totalHeight,
              8 * min,  // totalHeight,
              8 * min   // math.Infinity
              ]

    // else if(id === 'team') 
    else
      return [min,  // 0, 
              min,  // 0.24 * window.innerHeight,
              norm, // window.innerHeight, 
              norm, // top - window.innerHeight, 
              max,  // top, 
              // max,  // top + window.innerHeight,
              8 * min,  // totalHeight
              8 * min   // math.Infinity
              ]
            }

  function _initSegments(segments, hexWidth, totalHeight) {
    return _.reduce(segments, (ς, {id, top, height}) => {
      let domain  = _domain(id, top, height, hexWidth, totalHeight),
          range   = _range(id, top, height, hexWidth, totalHeight),
          scale   = d3.scaleLinear()
                      .domain(domain)
                      .range(range),

          ϱDomain = _ϱDomain(id, top, height, hexWidth, totalHeight),
          ϱRange  = _ϱRange(id, top, height, hexWidth, totalHeight),
          ϱScale  = d3.scaleLinear()
                      .domain(ϱDomain)
                      .range(ϱRange)
      ς[id]   = { σ: scale, ϱ: ϱScale, id: id, top: top, height: height}
      return ς }, {})}
  
  function _resize(parentId, β, segments) {
    _.delay(() => {
      let width       = math.round($(parentId).width()),  // the width of the svg canvas
          height      = math.round($(parentId).height()), // the height of the svg canvas
          hexWidth    = $(β.hex.node()).width(),
          // totalHeight = _.sumBy(segments, function(σ) { return σ.height })
          totalHeight = $('#footer').position().top

      β.svg
        .attr('width', width)
        .attr('height', height)
      β.group.attr('transform', 'translate(' + xFocus(width) + ',' + yFocus(height) + ')')
      β.hex.attr('transform', 'scale(' + hexScale(width) + ')')
    
      // hackedy hack
      // get the hex dimension after scaling via jq
      β.hexWidth = $(β.hex.node()).width()
      β.segments = _initSegments(segments, hexWidth, totalHeight)
    
      unitSegment = { id: 'unit',
                      σ:  d3.scaleLinear().domain([0, 1]).range([1, 1]),
                      ϱ:  d3.scaleLinear()
                           .domain([0, 0.24 * window.innerHeight, window.innerHeight, math.Infinity])
                           .range([2, 2, β.hexWidth, β.hexWidth]) }
      }, 0)
     }

  function initialize(parentId) {
    var svg             = d3.select(parentId)
                            .append('svg'),
        defs            = svg.append('defs'),
        group           = svg.append('g'),
        hex             = defs.append('path')
                            .attr('d', HEXAGON)
                            .attr('id', 'hex'),
        // simulation
        // ————————————————
        hexNodes    = d3.range(0, COUNT).map((d) => { 
                        return {color:  color(d), 
                                id:     section(d),
                                radius: 2,
                                x:      math.random(-256, 256),
                                y:      math.random(-256, 256)
                              }}),
        origin      = {id: 'origin', x: 0, y: 0, fx: 0, fy: 0, radius: 1},
        nodes       = _.concat(hexNodes, origin),
        
        colissionΦ  = d3.forceCollide()
                        .iterations(12)
                        .radius((d, i) => {return d.radius}),

        // xΦ          = d3.forceY(0),
        // yΦ          = d3.forceX(0),
        centerΦ     = _.map(hexNodes, (η) => {
                        return {η: η,
                                φ: d3.forceCenter(0, 0)}}),

  
        simulation  = d3.forceSimulation(),
       
        node        = group.append('g')
                        .attr('class', 'nodes')
                        .selectAll('.hex')
                        .data(nodes)
                        .enter()
                          .append('g')
                            .attr('id', (d, i) => {return 'hex-' + (d.id || i)})
                            .attr('class', 'hex')
                            .attr('transform', (d) => { return 'translate(' + math.random(-256, 256) + ',' + math.random(-256, 256) + ')'})
                            .each(function(d) {
                              d3.select(this).append('use')
                                .attr('xlink:href', '#hex')
                                .attr('fill', d.color)})

    function ticked() {
      // as the radii change, constantly update the collissionΦ
      colissionΦ.radius((η, i) => {return η.radius})
      node.attr('transform', (d) => { 
        let x = math.round(d.x),
            y = math.round(d.y)
        return 'translate(' + x + ',' + y + ')'})}  
    
    // initialize the simulation and attach event handler
    simulation
      .nodes(nodes)
      .on('tick', ticked)

    simulation.force('colission', colissionΦ)
    _.each(centerΦ, ({η, φ}) => { simulation.force(η.id, φ) })

    // initialize without the origin node.
    colissionΦ.initialize(hexNodes)
    // xΦ.initialize(hexNodes)
    // yΦ.initialize(hexNodes)
    // initialize without any nodes
    _.each(centerΦ, ({η, φ}) => {φ.initialize([η])})

    return { svg:         svg, 
             group:       group, 
             hex:         hex,
             simulation:  simulation,
             nodes:       nodes,
             node:        node,
             force:       { center: centerΦ }
           }}

  function focus(β) {
    if(_.isNil(β.segments)){
      _.delay(() => {focus(β)}, 100)
      return }

    let δ = window.pageYOffset

    β.node.each((d, i) => {
      var dom = d3.select('#hex-' + d.id).select('use')
      dom.attr('transform', (η) => {
        let segment = β.segments[η.id] || unitSegment
        η.radius = segment.ϱ(δ)
        return 'scale(' + segment.σ(δ) + ')' })})
    β.simulation.alphaTarget(0.3)
    β.simulation.restart()
    return β }

  function init(parentId, segments) {
    let β = initialize(parentId)
    _resize(parentId, β, segments)
    // Debounce to avoid costly calculations while the window size is in flux.
    $(window).on('resize', _.debounce(() => {_resize(parentId, β, segments)}, 150))
    return β }

  module.exports = { 
    init:     init,
    focus:    focus }
})()
