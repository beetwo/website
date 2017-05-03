import config from './marching-cubes-config'

// ■Cubes
// メタボール生成のための格子クラス
// —Lattice class for metaball generation
  function _getCellPattern( x, y, ͻ ) {
    let pointCount  = ͻ.config.pointCount,
        separation  = ͻ.config.separation,
        pattern     = 0
    if( ͻ.points[x + y * pointCount] > separation ) pattern += 1
    if( ͻ.points[(x + 1) + y * pointCount] > separation ) pattern += 2
    if( ͻ.points[x + (y + 1) * pointCount] > separation ) pattern += 4
    if( ͻ.points[(x + 1) + (y + 1) * pointCount] > separation ) pattern += 8
    return pattern }

  function _getTraceList( x, y, state ) {
    let pattern = _getCellPattern( x, y, state ),
        tl      = state.config.tracer[pattern]
    return tl }

  function _getCellPoint( x, y, state ) {
    let points      = state.points,
        pointCount  = state.config.pointCount,
        cubeSize    = state.config.cubeSize

    return  { x: x * cubeSize,
              y: y * cubeSize,
              v: points[x + (y * pointCount)]}}

  function _addPolygonPoint( x, y, di, state ) { // di->進行方向 —Direction
    let separation  = state.config.separation,
        p1          = _getCellPoint( x + di.px1, y + di.py1, state ),
        p2          = _getCellPoint( x + di.px2, y + di.py2, state ),
        t           = (separation - p1.v) / (p2.v - p1.v),
        px          = p1.x + (p2.x - p1.x) * t,
        py          = p1.y + (p2.y - p1.y) * t
    state.polygon.push( {x: px, y: py} ) }

  function _getOneTip( traceList, dx, dy ) {
    if(_.size(traceList) === 0) 
      return null
    if( dx === null && dy === null ) 
      return traceList[0]
    return _.reduce(traceList, function(r, d ){
                    if( d[0].x === dx && d[0].y === dy ) 
                      r = [d[0], d[1]] 
                    else if( d[1].x === dx && d[1].y === dy ) 
                      r = [d[1], d[0]] 
                    return r }, null)}

  function _borderTrace( x, y, dx, dy, ax, ay, state ) { // dx,dy 来た方向 ax,ay スライドする向き
    let count     = state.config.pointCount - 1,
        cubeSize  = state.config.cubeSize,
        points    = state.points,
        nx        = x + ax,
        ny        = y + ay

    if( nx < 0 || count <= nx || ny < 0 || count <= ny ) {

        // 折り返し —return
        let px = x * (x + 1) * cubeSize,
            py = y * (y + 1) * cubeSize
        
        state.polygon.push( {x: px, y: py} )
        state.corner += 1

        _borderTrace( x + dx, y + dy, ax, ay, -dx, -dy, state )

    } else {
        let traceList = _getTraceList( nx, ny, state ),
            diList    = _getOneTip( traceList, dx, dy )

        if( diList === null ) 
          _borderTrace( nx, ny, dx, dy, ax, ay, state )
        else {
            _addPolygonPoint( nx, ny, diList[0], state )
            _trace( nx, ny, dx, dy, state ) } } }
 
  function _trace( x, y, dx, dy, state ) { // dx,dy来た方向
    let cells = state.cells,
        count = state.config.pointCount - 1,
        index = x + (y * count)

    // 一周してきた —It has been around
    if( cells[index] === 0 ) return
    cells[index] -= 1

    let traceList = _getTraceList( x, y, state ),
        diList    = _getOneTip( traceList, dx, dy ) // ないってありえない

    if( dx === null && dy === null ) 
      _addPolygonPoint( x, y, diList[0], state )

    let di = diList[1]

    _addPolygonPoint( x, y, di, state )

    if( x + di.x < 0 || count <= x + di.x ) 
      // あふれた
      // 上か下にスライドさせる —Slide up or down
      _borderTrace( x, y, di.x, di.y, 0, di.py2 * 2 - 1, state )

    else if( y + di.y < 0 || count <= y + di.y )
      // 左右にスライドさせる —Slide left and right
      _borderTrace( x, y, di.x, di.y, di.px2 * 2 - 1, 0, state )

    else 
      _trace( x + di.x, y + di.y, -di.x, -di.y, state ) }

  // maching cubes functions
  // ————————————————————————————————
  function update(cubes, func) {
    // console.log('cubes.update', _.cloneDeep(cubes))
    let count     = cubes.config.pointCount,
        cubeSize  = cubes.config.cubeSize,
        points    = []

    _.times(count, function(y) {
          _.times(count, function(x) {
            let index = x + y * count,
                value = func( x * cubeSize, y * cubeSize, cubes.points[index]) 
            points[index] = value }) }) 

    cubes.points = points
    return cubes }

  function getPolygons(cubes) {
    // Polygon is extracted from the result of points
    let cells   = cubes.cells,
        count   = cubes.config.pointCount - 1,
        result  = []

    // セルを初期化する —Initialize the cells
    _.times(count, function(y) {
      _.times(count, function(x) {
        let index = x + (y * count),
            tl    = _getTraceList( x, y, cubes )
        cells[index] = tl.length })})

    _.times(count, function(y) {
      _.times(count, function(x) {
        cubes.polygon = []
        cubes.corner  = 0
        _trace( x, y, null, null, cubes )

        if( cubes.polygon.length > 0 ) 
          result.push( cubes.polygon )})})

    return result }
  

  function init(width, height) {
    let νPx     = math.floor(width / config.cubeSize),
        νPy     = math.floor(height / config.cubeSize),
        points  = _(νPx * νPy)
                    .range()
                    .map(function(){return 0})
                    .value(),
        
        cells   = _((νPx - 1) * (νPy - 1))
                    .range()
                    .map(function(){return 0})
                    .value()

    config.pointCount = νPx
  
    return {  points: points,
              cells:  cells,
              config: config } }

  export default { init:        init,
                   update:      update,
                   getPolygons: getPolygons }
