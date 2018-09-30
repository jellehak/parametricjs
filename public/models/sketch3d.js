export default {
  title: 'Sketch',
  features: [
    {
      id: 15345345,
      type: 'sketch3d',
      description: 'box',
      parameters: ['height', 'width'],
      path: [
        { x: 0, y: 0, z: 0 },
        { x: 'width', y: 0, z: 0 },
        { x: 'width * 2', y: 'height', z: 0 },
        { x: 0, y: 'height', z: 0 }
      ]
    },

    {
      type: 'svg',
      path: 'M305.214,374.779c2.463,0,3.45,0.493'
    },

    {
      id: 2,
      type: '3dshape',
      description: 'box',
      parameters: ['height', 'width'],
      shape: [
        { x: 0, y: 0, z: 0 },
        { x: 'height', y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 }
      ]
    }
  ]
}
