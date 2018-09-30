export default {
  title: 'Simple Pattern',
  features: [{
    id: 'heart',
    type: 'sketcharray',
    path: [
      ['moveTo', 5, 5],
      ['bezierCurveTo', 5, 5, 4, 0, 0, 0],
      ['bezierCurveTo', -6, 0, -6, 7, -6, 7],
      ['bezierCurveTo', -6, 11, -3, 15.4, 5, 19],
      ['bezierCurveTo', 12, 15.4, 16, 11, 16, 7],
      ['bezierCurveTo', 16, 7, 16, 0, 10, 0],
      ['bezierCurveTo', 7, 0, 5, 5, 5, 5]
    ]
  },
  {
    id: 'cutsketch',
    type: 'sketch',
    path: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 }
    ]
  },
  {
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
  }
  ]
}
