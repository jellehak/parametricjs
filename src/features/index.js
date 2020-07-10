// import insert from './insert.js'
import plane from './plane.js'
import extrude from './extrude.js'
import pattern from './pattern.js'
import sketch from './sketch.js'
import cut from './cut.js'
import point from './point.js'
// import sketcharray from './sketchArray'

export {
  point,
  // insert,
  plane,
  extrude,
  pattern,
  sketch,
  cut
}

// ==============
// Auto register all features
// const requireComponent = require.context(
//   './', // Look for files in the @/components directory
//   false, // include subdirectories
//   /\.js$/
// )

// requireComponent.keys().map(fileName => {
//   requireComponent(fileName).default
// })
