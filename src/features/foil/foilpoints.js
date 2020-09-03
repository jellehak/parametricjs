/*
Based on info from:
http://airfoiltools.com/airfoil/details?airfoil=naca0006-il
https://cad.onshape.com/documents/4bf18c75321ea2c8c2ea770d/w/978aece63f59e09169309756/e/b319e7a87bba701e3e02a0fa
https://cad.onshape.com/documents/58617bcbcec3fd1081e6dda0/w/14c073fff5640d9c20af40b5/e/678fab6c3565fbb965a41b12
*/
// import csv from './csv/dae_11.csv'
import csv from './data/dae_11.js'
import { CSVToArray } from './utils.js'

export default {
  props: {
    profile: {
      type: 'enum',
      items: [
        'dae_11',
        'doa5-il'
      ]
    },
    cord: {
      type: 'number',
      default: 1
    }
  },

  render ({ THREE }) {
    const path = CSVToArray(csv)
    // console.log(path)

    // Create array of Points
    var points = []
    path.forEach(elem => {
      points.push(new THREE.Vector3(elem[0], elem[1], 0))
    })
    // console.log(points)

    // Group points in a THREE.Shape
    return points
  }

}
