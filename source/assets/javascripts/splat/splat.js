import sim from './simulation'
import dom from './dom'
import μCubes from '../geom/marching-cubes'

// 境界 — boundary
let NODE_COUNT = 4

function init(parent) {
  console.log('initializing splat', parent, μCubes)
  let width       = 256,
      height      = 256,
      // width       = $(parent).width(),
      // height      = $(parent).height(),
      dimensions  = { x: width, y: height },
      position    = { x: width /2, y: height /2 },

      // 境界生成 —Boundary generation
      cubes       = μCubes.init(width, height),
      svg         = dom(parent, width, height),
      nodes       = _(NODE_COUNT)
                      .range()
                      .map(() => {
                        return {  x: position.x + math.random( -24.0, 24.0 ),
                                  y: position.y + math.random( -24.0, 24.0 ) } } )
                      .value()

  // start the simulation
  sim(nodes, cubes, position, dimensions, svg.render) }

// export
// ————————————————————————————————
export default init
