import vector from '../geom/vector'
import μCubes from '../geom/marching-cubes'


  let MIN_CLICK_DELAY    =   64,
      MAX_CLICK_DELAY    =  240,
      MIN_MOVE_DELAY     =   12,
      MAX_MOVE_DELAY     =   81,
      CLICK_STRENGTH     = -160,
      MOVE_STRENGTH      =  -80,
      CLICK_JIGGLE       =   64,
      MOVE_JIGGLE        =   12,
      MIN_RADIUS         =   48,
      MAX_RADIUS         =  192,
      FREQUENCY          =   50

  let moveΣ         = d3.scalePow()
                        .exponent(1)
                        .domain([           100,            24, 0])
                        .range( [ MOVE_STRENGTH, MOVE_STRENGTH, 0]),

      lineFunction  = d3.line()
                      .x( function( d ) { return d.x } )
                      .y( function( d ) { return d.y } )
                      .curve(d3.curveBasisClosed)
 
  function _figureFn(nodes, radius){
    return  function(x, y) {
      let value = _.reduce( nodes, function( value, node ) {
                    let p  = {x: x, y: y},
                        δ  = vector.distance(node, p)
                    if( δ < radius) value += (1.0 - (δ / radius))
                    return value }, 0 )
      return value }}

  function _mouse(self) {
    return vector.fromArray(d3.mouse(self)) }

  function _renderNodes(nodes, svg) {
    let n = svg.selectAll('circle')
              .data(nodes)
    n.exit().remove()
    n.enter()
      .append( 'svg:circle' )
      .merge(n)
        .attr('class', function(d) {return d.type}) 
        .attr('cx', function(d) {return d.x}) 
        .attr('cy', function(d) {return d.y})}

  function _renderPaths( polygons, svg, handlers ) {
    let p = svg.selectAll('path')
              .data(polygons)
    p.exit().remove()
    p.enter()
      .append( 'svg:path' )
        .on('click', handlers.click)
        .on('mouseenter', handlers.enter)
        .on('mouseexit', handlers.exit)
        .on('mousemove', handlers.move)
      .merge(p)
        .attr('d', function(d) {
          return lineFunction(d)}) } 

  function _jiggle(nodes, δ) {
    _.each(nodes, function(n) {
      let ρ = { x: math.random(-1.0, 1.0), 
                y: math.random(-1.0, 1.0)},
          ξ = δ * math.random(-0.81, 1.2),
          τ = vector.normalizeTo(ρ, ξ)
        n.vx = τ.x
      n.vy = τ.y })}

  function _updateRadius(radius, τRadius) {
    let δ = τRadius - radius
    if(math.abs(δ) < 1) return τRadius
    return radius + (0.06 * δ) }

  function _updateStrength(strength, τStrength, force) {
    let δ = τStrength - strength

    if( δ === 0 ) return τStrength
    if( math.abs(δ) < 1 ) {
      force.strength(τStrength)
      return τStrength }

    strength += math.random(0.02 * δ, 0.06 * δ)
    force.strength(strength)
    return strength }

  function _updatePosition(position, τPosition) {
    let δx = τPosition.x - position.fx,
        δy = τPosition.y - position.fy

    if(math.abs(δy) < 1 && math.abs(δy) < 1 ) {
      position.fx = τPosition.x
      position.fy = τPosition.y } 
    else {
      position.fx += (0.06 * δx)
      position.fy += (0.06 * δy) }
    return position }


  function initialize(nodes, cubes, position, dimensions, tikk) {

    console.log('initialize splat simulation', nodes, cubes, position, dimensions)

    let simulation  = d3.forceSimulation(),
        // the links between the nodes and the target position
        // do it here at the beginning, before any other nodes are added
        links       = _.map(nodes, function(n) { return { source: n, target: position }}),
        lForce      = d3.forceLink(links)
                        .strength(0.42)
                        .distance(2),
        strength    = 0,
        τStrength   = strength,
        mForce      = d3.forceManyBody()
                        .strength(strength),

        pMouse, 
        // flag indicating that the splat is splattered, ie. the multibody force is repelling the nodes
        splattered  = false,
        // the current radius of the nodes
        radius      = MIN_RADIUS,
        // the target radius of the nodes. 
        // if different from radius, the nodes will grow/shrink toward it
        τRadius     = radius,

        topRight    = { x: dimensions.x * 0.8, y: dimensions.y * 0.2 },
        center      = { x: dimensions.x * 0.5, y: dimensions.y * 0.5 },
        offScreen   = { x: dimensions.x * 1.2, y: dimensions.y * -0.2 },
        τPosition   = center

    let handlers = {
      click:  function() {
                if(!splattered) {
                  splattered  = true 
                  τStrength   = CLICK_STRENGTH
                  τRadius     = MAX_RADIUS
                  τPosition   = center } 
                else {
                  splattered  = false
                  τStrength   = 0
                  τRadius     = MIN_RADIUS
                  τPosition   = center }
                // _jiggle(nodes, CLICK_JIGGLE)

        d3.timeout(() => {  splattered  = false
                            τStrength   = 0
                            τRadius     = MIN_RADIUS
                            τPosition   = center  },
          math.random(MIN_CLICK_DELAY, MAX_CLICK_DELAY))
      },

      enter:  function(mouse) { 
                pMouse = mouse
                if(!splattered) 
                  _jiggle(nodes, MOVE_JIGGLE) },
      exit:   function() { pMouse = null },
      move:   function(mouse) {
                if(splattered) return
                let δ = vector.δ(mouse, pMouse),
                    ς = moveΣ(δ)
                mForce.strength(ς)
                d3.timeout(function(){
                  mForce.strength(0)
                }, math.random(MIN_MOVE_DELAY, MAX_MOVE_DELAY))
                pMouse = mouse} }

    position.type = 'target'
    position.fx   = center.x // fix in place
    position.fy   = center.y
    nodes.push(position)
    
    simulation
      .nodes(nodes)
      .force('l', lForce)
      .force('m', mForce)

    simulation.on('tick', function() {
      radius    = _updateRadius(radius, τRadius)
      position  = _updatePosition(position, τPosition)
      strength  = _updateStrength(strength, τStrength, mForce)
      cubes     = μCubes.update(cubes, _figureFn(this.nodes(), radius) )

      // call the function passed by splat
      tikk(μCubes.getPolygons(cubes), this.nodes(), handlers) })

    // mForce.strength(CLICK_STRENGTH)
    // splattered  = true 
    // τRadius     = MAX_RADIUS
    // τPosition   = center

    simulation.alphaTarget(0.3).restart() }
  
export default initialize
