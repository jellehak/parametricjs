// import Parametric from '../parametric.js'
// import * as Parametric from '../parametric.js'
const {Parametric} = window

const { y3d } = window

const cad = {
  title: 'Simple box',
  features: [{
    id: 'box',
    type: 'sketch',
    plane: 'front',
    path: [{
      x: 0,
      y: 0
    }, {
      x: 4,
      y: 0
    }, {
      x: 4,
      y: 4
    }, {
      x: 0,
      y: 4
    }, {
      x: 0,
      y: 0
    }]
  }, {
    type: 'extrude',
    selectById: 'box',
    amount: 4
  }]
}

const {
  scene,
  add
} = y3d.setup({
  camera: {
    x: 100,
    y: 100,
    z: 100
  },
  size: '1 unit = 1 mm',
  background: '#fff'
})
add({
  type: 'axis'
})

let part = Parametric.create({ cad, scene })
scene.add(part.render())
