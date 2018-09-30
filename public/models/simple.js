export default {
  title: 'Simple Pattern',
  features: [{
    id: 'box',
    type: 'sketch',
    plane: 'top',
    path: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 0, y: 0 }
    ]
  },
  {
    type: 'extrude',
    id: 'extrude1',
    suppress: false,
    selectById: 'box',
    amount: 4
  }
  ]
}
